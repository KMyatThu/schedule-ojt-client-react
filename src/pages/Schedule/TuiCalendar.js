import React, { Component } from "react";
import axios from "../../axios";
import moment from "moment";
import TUICalendar from "@toast-ui/react-calendar";

import "tui-calendar/dist/tui-calendar.css";
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";

class TuiCalendar extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.calendarRef = React.createRef(null);
    this.state = {
      errors: {},
      schedules: [],
      calendars: [],
      templates: [],
      renderRange: ""
    };

    this.onBeforeCreateSchedule = this.onBeforeCreateSchedule.bind(this);
    this.handleSaveSchedule = this.handleSaveSchedule.bind(this);
    this.onBeforeUpdateSchedule = this.onBeforeUpdateSchedule.bind(this);
    this.onBeforeDeleteSchedule = this.onBeforeDeleteSchedule.bind(this);
    this.fetchSchedulesByLoginUser = this.fetchSchedulesByLoginUser.bind(this);
    this.setRenderRangeText = this.setRenderRangeText.bind(this);
    this.currentCalendarDate = this.currentCalendarDate.bind(this);
  }

  // Before Create schedules Set up
  // Display schedules on Calendar
  // Update State
  onBeforeCreateSchedule(scheduleData) {
    const newSchedule = {
      // id: String(Math.random()),
      calendarId: scheduleData.calendarId,
      title: scheduleData.title,
      isAllDay: scheduleData.isAllDay,
      start: scheduleData.start,
      end: scheduleData.end,
      category: scheduleData.isAllDay ? "allday" : "time",
      dueDateClass: "",
      location: scheduleData.location,
      state: scheduleData.state
    };

    this.calendarRef.current.calendarInst.createSchedules([newSchedule]);
    this.setState({
      schedules: [...this.state.schedules, newSchedule]
    })
  }

  // set up before updated schedule
  // display updated shedule on calendar
  // schedules state update
  onBeforeUpdateSchedule(ScheduleData) {
    const { changes } = ScheduleData;
    const updatedSchedule = ScheduleData.schedule;
    this.calendarRef.current.calendarInst.updateSchedule(
      updatedSchedule.id,
      updatedSchedule.calendarId,
      changes
    );

    const { schedules } = this.state;
    const updatedSchedules = schedules.map((schedule) => {
      return schedule.id === updatedSchedule.id ? { ...schedule, ...changes } : schedule
    })
    this.setState({
      schedules: updatedSchedules
    })
  }

  // Before delete Set up
  // Remove deleted schedule from calendar
  // Update State schedules
  onBeforeDeleteSchedule(scheduleData) {
    const { id, calendarId } = scheduleData.schedule;
    this.calendarRef.current.calendarInst.deleteSchedule(id, calendarId);
    const { schedules } = this.state;
    const deletedSchedules = schedules.filter(schedule => schedule.id !== id)
    this.setState({
      schedules: deletedSchedules
    })
  }

  // Prepare for date format
  currentCalendarDate(format) {
    var currentDate = moment([
      this.calendarRef.current.calendarInst.getDate().getFullYear(),
      this.calendarRef.current.calendarInst.getDate().getMonth(),
      this.calendarRef.current.calendarInst.getDate().getDate()
    ]);
    return currentDate.format(format);
  }

  // Set up for display date range
  setRenderRangeText() {
    var options = this.calendarRef.current.calendarInst.getOptions();
    var viewName = this.calendarRef.current.calendarInst.getViewName();

    var html = [];
    if (viewName === "day") {
      html.push(this.currentCalendarDate("YYYY.MM.DD"));
    } else if (
      viewName === "month" &&
      (!options.month.visibleWeeksCount ||
        options.month.visibleWeeksCount > 4)
    ) {
      html.push(this.currentCalendarDate("YYYY.MM"));
    } else {
      html.push(
        moment(this.calendarRef.current.calendarInst.getDateRangeStart().getTime()).format(
          "YYYY.MM.DD"
        )
      );
      html.push(" ~ ");
      html.push(
        moment(this.calendarRef.current.calendarInst.getDateRangeEnd().getTime()).format(
          "YYYY.MM.DD"
        )
      );
    }
    this.setState({
      renderRange: html.join("")
    })
  }

  // Save All Schedules
  handleSaveSchedule() {
    if (window.confirm("Are you sure want to save schedules!")) {
      const data = this.state.schedules;
      axios.post("schedules/create", data)
        .then(alert("Successfull saved schedules"))
        .catch(error => {
          if (error.response) {
            console.error(error.response.data);
            if (error.response.data.errors) {
              this.setState({
                errors: error.response.data.errors
              });
            }
          }
        });
    } else {
      alert("You Click Cancel!")
    }
  }

  // Fetch All Schedules By Login User
  fetchSchedulesByLoginUser() {
    axios.get("schedules").then(res => {
      if (this._isMounted) {
        this.setState({
          schedules: res.data
        })
      }
    }).catch(error => {
      if (error.response) {
        console.error(error.response.data);
        if (error.response.data.errors) {
          this.setState({
            errors: error.response.data.errors
          });
        }
      }
    });
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchSchedulesByLoginUser();
    this.setRenderRangeText();
    this.setState({
      calendars: [
        {
          id: 1,
          name: "My Calendar",
          color: "#ffffff",
          bgColor: "#9e5fff",
          dragBgColor: "#9e5fff",
          borderColor: "#9e5fff"
        },
        {
          id: 2,
          name: "Company",
          color: "#ffffff",
          bgColor: "#F4696A",
          dragBgColor: "#F4696A",
          borderColor: "#F4696A"
        },
        {
          id: 3,
          name: "Travel",
          color: "#ffffff",
          bgColor: "#00a9ff",
          dragBgColor: "#00a9ff",
          borderColor: "#00a9ff"
        }
      ],
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { schedules, calendars, renderRange } = this.state;
    return (
      <div>
        <div className="p-3">
          {/* Previous days button */}
          <button
            type="button"
            className="btn btn-default btn-sm move-day"
            style={{ marginRight: "4px" }}
            data-action="move-prev"
            onClick={() => {
              this.calendarRef.current.calendarInst.prev();
              this.setRenderRangeText();
            }}
          >
            <i
              className="calendar-icon ic-arrow-line-left"
              data-action="move-prev"
            />
          </button>

          {/* Display range in a week */}
          <span id="renderRange" className="render-range">
            {renderRange}
          </span>
          <button
            type="button"
            className="btn btn-default btn-sm move-day"
            style={{ marginRight: "4px" }}
            data-action="move-next"
            onClick={() => {
              this.calendarRef.current.calendarInst.next();
              this.setRenderRangeText();
            }}
          >
            <i
              className="calendar-icon ic-arrow-line-right"
              data-action="move-next"
            />
          </button>

          {/* Next days button */}
          <button
            type="button"
            className="btn btn-default btn-sm move-today float-right"
            style={{ marginRight: "4px" }}
            data-action="move-today"
            onClick={() => {
              this.calendarRef.current.calendarInst.today();
              this.setRenderRangeText();
            }}
          >
            Today
          </button>
        </div>

        {/* Toast UI Calendar Component */}
        <TUICalendar
          height="450px"
          view="week"
          taskView={false}
          scheduleView={true}
          ref={this.calendarRef}
          schedules={schedules}
          calendars={calendars}
          useCreationPopup={true}
          useDetailPopup={true}
          disableClick={true}
          onBeforeCreateSchedule={this.onBeforeCreateSchedule}
          onBeforeUpdateSchedule={this.onBeforeUpdateSchedule}
          onBeforeDeleteSchedule={this.onBeforeDeleteSchedule}
        />

        {/* Save Schedules Button */}
        <button
          className="mt-4 btn btn-primary float-right"
          onClick={this.handleSaveSchedule}>
          Save Schedules
        </button>
      </div>
    );
  }
}

export default TuiCalendar;