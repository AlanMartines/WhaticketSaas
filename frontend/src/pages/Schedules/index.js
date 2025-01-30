import React, { useState, useEffect, useReducer, useCallback, useContext, useRef } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import ScheduleModal from "../../components/ScheduleModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import moment from "moment";
import { SocketContext } from "../../context/Socket/SocketContext";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SearchIcon from "@material-ui/icons/Search";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";

import "./Schedules.css"; 

const getUrlParam = (paramName) => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(paramName);
};

const localizer = momentLocalizer(moment);

const defaultMessages = {
  date: "Data",
  time: "Hora",
  event: "Evento",
  allDay: "Dia Todo",
  week: "Semana",
  work_week: "Agendamentos",
  day: "Dia",
  month: "Mês",
  previous: "Anterior",
  next: "Próximo",
  yesterday: "Ontem",
  tomorrow: "Amanhã",
  today: "Hoje",
  agenda: "Agenda",
  noEventsInRange: "Não há agendamentos no período.",
  showMore: (total) => `+${total} mais`,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_SCHEDULES":
      return [...state, ...action.payload];

    case "UPDATE_SCHEDULES":
      const updatedSchedules = state.map((s) =>
        s.id === action.payload.id ? action.payload : s
      );
      return state.some((s) => s.id === action.payload.id)
        ? updatedSchedules
        : [action.payload, ...state];

    case "DELETE_SCHEDULE":
      return state.filter((s) => s.id !== action.payload);

    case "RESET":
      return [];

    default:
      return state;
  }
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
}));

const Schedules = () => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const socketManager = useContext(SocketContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [deletingSchedule, setDeletingSchedule] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [schedules, dispatch] = useReducer(reducer, []);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [contactId, setContactId] = useState(+getUrlParam("contactId"));

  const debounceTimeout = useRef(null);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/schedules/", {
        params: { searchParam, pageNumber },
      });

      dispatch({ type: "LOAD_SCHEDULES", payload: data.schedules });
      setHasMore(data.hasMore);
    } catch (err) {
      toastError(err);
    } finally {
      setLoading(false);
    }
  }, [searchParam, pageNumber]);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(fetchSchedules, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber, fetchSchedules]);

  useEffect(() => {
    if (contactId) {
      setScheduleModalOpen(true);
    }

    const socket = socketManager.getSocket(user.companyId);
    socket.on(`company${user.companyId}-schedule`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_SCHEDULES", payload: data.schedule });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_SCHEDULE", payload: +data.scheduleId });
      }
    });

    socket.on("disconnect", () => {
      setTimeout(() => {
        socket.connect();
      }, 5000);
    });

    return () => socket.disconnect();
  }, [socketManager, user]);

  const handleSearch = (event) => {
    clearTimeout(debounceTimeout.current);
    const value = event.target.value.toLowerCase();

    debounceTimeout.current = setTimeout(() => {
      setSearchParam(value);
      setPageNumber(1);
    }, 300);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await api.delete(`/schedules/${scheduleId}`);
      toast.success(i18n.t("schedules.toasts.deleted"));
      dispatch({ type: "DELETE_SCHEDULE", payload: scheduleId });
    } catch (err) {
      toastError(err);
    }
    setDeletingSchedule(null);
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={deletingSchedule && i18n.t("schedules.confirmationModal.deleteTitle")}
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => handleDeleteSchedule(deletingSchedule.id)}
      >
        {i18n.t("schedules.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <ScheduleModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        reload={fetchSchedules}
        scheduleId={selectedSchedule?.id}
      />
      <MainHeader>
        <Title>{i18n.t("schedules.title")} ({schedules.length})</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder={i18n.t("contacts.searchPlaceholder")}
            type="search"
            value={searchParam}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" color="primary" onClick={() => setScheduleModalOpen(true)}>
            {i18n.t("schedules.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper}>
        <Calendar
          messages={defaultMessages}
          localizer={localizer}
          events={schedules.map((s) => ({
            title: s.contact.name,
            start: new Date(s.sendAt),
            end: new Date(s.sendAt),
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </Paper>
    </MainContainer>
  );
};

export default Schedules;
