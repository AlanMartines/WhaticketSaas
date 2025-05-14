import * as Sentry from "@sentry/node";
import makeWASocket, {
  Browsers,
  CacheStore,
	//useSingleFileAuthState,
	DisconnectReason,
	AnyMessageContent,
	delay,
	makeInMemoryStore,
	MessageType,
	//MessageOptions,
	//Mimetype,
	isJidGroup,
	//loadMessages,
	fetchLatestBaileysVersion,
	WASocket,
	AuthenticationState,
	BufferJSON,
	//getMessage,
	WA_DEFAULT_EPHEMERAL,
	//initInMemoryKeyStore,
	WAMessage,
	Contact,
	SocketConfig,
	BaileysEventMap,
	GroupMetadata,
	MiscMessageGenerationOptions,
	generateWAMessageFromContent,
	downloadContentFromMessage,
	downloadHistory,
	proto,
	generateWAMessageContent,
	prepareWAMessageMedia,
	WAUrlInfo,
	useMultiFileAuthState,
	makeCacheableSignalKeyStore,
	isJidBroadcast,
	//MessageRetryMap,
	getAggregateVotesInPollMessage,
	WAMessageContent,
	WAMessageKey,
	//PHONENUMBER_MCC,
	BinaryInfo,
	downloadAndProcessHistorySyncNotification,
	encodeWAM,
	getHistoryMsg,
	isJidNewsletter,
} from "@whiskeysockets/baileys";
import makeWALegacySocket from "@whiskeysockets/baileys";
import P from "pino";

import Whatsapp from "../models/Whatsapp";
import { logger } from "../utils/logger";
import MAIN_LOGGER from "@whiskeysockets/baileys/lib/Utils/logger";
import authState from "../helpers/authState";
import { Boom } from "@hapi/boom";
import AppError from "../errors/AppError";
import { getIO } from "./socket";
import { Store } from "./store";
import { release } from "os";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";
import DeleteBaileysService from "../services/BaileysServices/DeleteBaileysService";
import NodeCache from 'node-cache';

const loggerBaileys = MAIN_LOGGER.child({});
loggerBaileys.level = "error";

type Session = WASocket & {
  id?: number;
  store?: Store;
};

const sessions: Session[] = [];

const retriesQrCodeMap = new Map<number, number>();

export const getWbot = (whatsappId: number): Session => {
  const sessionIndex = sessions.findIndex(s => s.id === whatsappId);

  if (sessionIndex === -1) {
    throw new AppError("ERR_WAPP_NOT_INITIALIZED");
  }
  return sessions[sessionIndex];
};

export const removeWbot = async (
  whatsappId: number,
  isLogout = true
): Promise<void> => {
  try {
    const sessionIndex = sessions.findIndex(s => s.id === whatsappId);
    if (sessionIndex !== -1) {
      if (isLogout) {
        sessions[sessionIndex].logout();
        sessions[sessionIndex].ws.close();
      }

      sessions.splice(sessionIndex, 1);
    }
  } catch (err) {
    logger.error(err);
  }
};

export const initWASocket = async (whatsapp: Whatsapp): Promise<Session> => {
  return new Promise(async (resolve, reject) => {
    try {
      (async () => {
        const io = getIO();

        const whatsappUpdate = await Whatsapp.findOne({
          where: { id: whatsapp.id }
        });

        if (!whatsappUpdate) return;

        const { id, name, provider } = whatsappUpdate;

        const { version, isLatest } = await fetchLatestBaileysVersion();
        const isLegacy = provider === "stable" ? true : false;

        const useStore = !process.argv.includes('--no-store');
        const doReplies = process.argv.includes('--do-reply');
        const usePairingCode = process.argv.includes('--use-pairing-code');
        const useMobile = process.argv.includes('--mobile');

        logger.info(`using WA v${version.join(".")}, isLatest: ${isLatest}`);
        logger.info(`isLegacy: ${isLegacy}`);
        logger.info(`Starting session ${name}`);
        let retriesQrCode = 0;

        let wsocket: Session = null;
        const store = makeInMemoryStore({
          logger: loggerBaileys
        });

        const { state, saveState } = await authState(whatsapp);

        const msgRetryCounterCache = new NodeCache();
        const userDevicesCache: CacheStore = new NodeCache();

        const BROWSER_CLIENT = process.env.BROWSER_CLIENT ? process.env.BROWSER_CLIENT : 'EletroInfo';
        const BROWSER_NAME = process.env.BROWSER_NAME ? process.env.BROWSER_NAME : 'Chrome';

				wsocket = makeWASocket({
					/** URL do WS para conectar ao WhatsApp */
					//waWebSocketUrl: config.WA_URL,
					/** Falha a conexão se o socket expirar neste intervalo */
					connectTimeoutMs: 60000,
					/** Tempo limite padrão para consultas, undefined para nenhum tempo limite */
					defaultQueryTimeoutMs: undefined,
					/** Intervalo de ping-pong para conexão WS */
					keepAliveIntervalMs: 5000,
					/** Agente de proxy */
					agent: undefined,
					/** Logger do tipo pino */
					logger: loggerBaileys,
					/** Versão para conectar */
					version: version,
					/** Configuração do navegador */
					//browser: [String(BROWSER_CLIENT), String(BROWSER_NAME), String(release())],
					browser: [`${BROWSER_CLIENT}`, `${BROWSER_NAME}`, release()],
					/** Agente usado para solicitações de busca - carregamento/download de mídia */
					fetchAgent: undefined,
					/** Deve o QR ser impresso no terminal */
					printQRInTerminal: false,
					//
					mobile: useMobile,
					/** Deve eventos serem emitidos para ações realizadas por esta conexão de soquete */
					emitOwnEvents: true,
					/** Fornece um cache para armazenar mídia, para que não precise ser reenviada */
					//mediaCache: NodeCache,
					/** Hospedeiros personalizados de upload de mídia */
					//customUploadHosts: MediaConnInfo['hosts'],
					/** Tempo de espera entre o envio de novas solicitações de repetição */
					retryRequestDelayMs: 5000,
					/** Tempo de espera para a geração do próximo QR em ms */
					qrTimeout: 15000,
					/** Forneça um objeto de estado de autenticação para manter o estado de autenticação */
					//auth: state,
          auth: {
            creds: state.creds,
            //O armazenamento em cache torna o armazenamento mais rápido para enviar/receber mensagens
            keys: makeCacheableSignalKeyStore(state.keys, logger),
          },
					/** Gerencia o processamento do histórico com este controle; por padrão, sincronizará tudo */
					//shouldSyncHistoryMessage: boolean,
					/** Opções de capacidade de transação para SignalKeyStore */
					//transactionOpts: TransactionCapabilityOptions,
					/** Fornece um cache para armazenar a lista de dispositivos do usuário */
					//userDevicesCache: NodeCache,
					/** Marca o cliente como online sempre que o soquete se conecta com sucesso */
					//markOnlineOnConnect: true,
					/**
					 * Mapa para armazenar as contagens de repetição para mensagens com falha;
					 * usado para determinar se uma mensagem deve ser retransmitida ou não */
					msgRetryCounterCache: msgRetryCounterCache,
					/** Largura para imagens de visualização de link */
					linkPreviewImageThumbnailWidth: 192,
					/** O Baileys deve solicitar ao telefone o histórico completo, que será recebido assincronamente */
					syncFullHistory: true,
					/** O Baileys deve disparar consultas de inicialização automaticamente, padrão: true */
					fireInitQueries: true,
					/**
					 * Gerar uma visualização de link de alta qualidade,
					 * implica fazer upload do jpegThumbnail para o WhatsApp
					 */
					generateHighQualityLinkPreview: true,
					/** Opções para o axios */
					//options: AxiosRequestConfig || undefined,
					// Ignorar todas as mensagens de transmissão -- para receber as mesmas
					// comente a linha abaixo
					shouldIgnoreJid: jid => isJidBroadcast(jid),
					/** Por padrão, verdadeiro, as mensagens de histórico devem ser baixadas e processadas */
					//downloadHistory: true,
					/**
					 * Busque uma mensagem em sua loja
					 * implemente isso para que mensagens com falha no envio (resolve o problema "esta mensagem pode levar um tempo" possam ser reenviadas
					 */
					// implemente para lidar com repetições
					getMessage,
					// Para o botão de correção, mensagem de lista de modelos
					patchMessageBeforeSending,
				});

				async function getMessage(key) {
					if (store) {
						const msg = await store.loadMessage(key.remoteJid, key.id);
						return msg?.message || undefined;
					}
					// only if store is present
					return proto.Message.fromObject({});
				}
				//
				function patchMessageBeforeSending(message) {
					const requiresPatch = !!(
						message.buttonsMessage ||
						message.templateMessage ||
						message.listMessage
					);
					if (requiresPatch) {
						message = {
							viewOnceMessage: {
								message: {
									messageContextInfo: {
										deviceListMetadataVersion: 2,
										deviceListMetadata: {}
									},
									...message
								}
							}
						};
					}
					return message;
				}

        // wsocket = makeWASocket({
        //   logger: loggerBaileys,
        //   printQRInTerminal: false,
        //   //browser: Browsers.appropriate("Desktop"),
        //   browser: [`${BROWSER_CLIENT}`, `${BROWSER_NAME}`, release()],
        //   auth: {
        //     creds: state.creds,
        //     keys: makeCacheableSignalKeyStore(state.keys, logger),
        //   },
        //   version,
        //   msgRetryCounterCache,
        //   shouldIgnoreJid: jid => isJidBroadcast(jid),
 				// 	getMessage,
				// 	patchMessageBeforeSending,
        // });

        wsocket.ev.on(
          "connection.update",
          async ({ connection, lastDisconnect, qr }) => {
            logger.info(
              `Socket  ${name} Connection Update ${connection || ""} ${lastDisconnect || ""
              }`
            );

            if (connection === "close") {
              if ((lastDisconnect?.error as Boom)?.output?.statusCode === 403) {
                await whatsapp.update({ status: "PENDING", session: "" });
                await DeleteBaileysService(whatsapp.id);
                io.to(`company-${whatsapp.companyId}-mainchannel`).emit(`company-${whatsapp.companyId}-whatsappSession`, {
                  action: "update",
                  session: whatsapp
                });
                removeWbot(id, false);
              }
              if (
                (lastDisconnect?.error as Boom)?.output?.statusCode !==
                DisconnectReason.loggedOut
              ) {
                removeWbot(id, false);
                setTimeout(
                  () => StartWhatsAppSession(whatsapp, whatsapp.companyId),
                  2000
                );
              } else {
                await whatsapp.update({ status: "PENDING", session: "" });
                await DeleteBaileysService(whatsapp.id);
                io.to(`company-${whatsapp.companyId}-mainchannel`).emit(`company-${whatsapp.companyId}-whatsappSession`, {
                  action: "update",
                  session: whatsapp
                });
                removeWbot(id, false);
                setTimeout(
                  () => StartWhatsAppSession(whatsapp, whatsapp.companyId),
                  2000
                );
              }
            }

            if (connection === "open") {
              await whatsapp.update({
                status: "CONNECTED",
                qrcode: "",
                retries: 0
              });

              io.to(`company-${whatsapp.companyId}-mainchannel`).emit(`company-${whatsapp.companyId}-whatsappSession`, {
                action: "update",
                session: whatsapp
              });

              const sessionIndex = sessions.findIndex(
                s => s.id === whatsapp.id
              );
              if (sessionIndex === -1) {
                wsocket.id = whatsapp.id;
                sessions.push(wsocket);
              }

              resolve(wsocket);
            }

            if (qr !== undefined) {
              if (retriesQrCodeMap.get(id) && retriesQrCodeMap.get(id) >= 3) {
                await whatsappUpdate.update({
                  status: "DISCONNECTED",
                  qrcode: ""
                });
                await DeleteBaileysService(whatsappUpdate.id);
                io.to(`company-${whatsapp.companyId}-mainchannel`).emit("whatsappSession", {
                  action: "update",
                  session: whatsappUpdate
                });
                wsocket.ev.removeAllListeners("connection.update");
                wsocket.ws.close();
                wsocket = null;
                retriesQrCodeMap.delete(id);
              } else {
                logger.info(`Session QRCode Generate ${name}`);
                retriesQrCodeMap.set(id, (retriesQrCode += 1));

                await whatsapp.update({
                  qrcode: qr,
                  status: "qrcode",
                  retries: 0
                });
                const sessionIndex = sessions.findIndex(
                  s => s.id === whatsapp.id
                );

                if (sessionIndex === -1) {
                  wsocket.id = whatsapp.id;
                  sessions.push(wsocket);
                }

                io.to(`company-${whatsapp.companyId}-mainchannel`).emit(`company-${whatsapp.companyId}-whatsappSession`, {
                  action: "update",
                  session: whatsapp
                });
              }
            }
          }
        );
        wsocket.ev.on("creds.update", saveState);

        store.bind(wsocket.ev);
      })();
    } catch (error) {
      Sentry.captureException(error);
      console.log(error);
      reject(error);
    }
  });
};
