import React, { Component } from "react";
import axios from "../../axios";
import moment from "moment";
import TUICalendar from "@toast-ui/react-calendar";
import Button from "../../atoms/Button";
import CalendarNavBar from "../../components/CalendarNavBar";

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
      renderRange: "",
      initialDisabled: false
    };

    this.onBeforeCreateSchedule = this.onBeforeCreateSchedule.bind(this);
    this.handleSaveSchedule = this.handleSaveSchedule.bind(this);
    this.onBeforeUpdateSchedule = this.onBeforeUpdateSchedule.bind(this);
    this.onBeforeDeleteSchedule = this.onBeforeDeleteSchedule.bind(this);
    this.fetchSchedulesByLoginUser = this.fetchSchedulesByLoginUser.bind(this);
    this.setRenderRangeText = this.setRenderRangeText.bind(this);
    this.currentCalendarDate = this.currentCalendarDate.bind(this);
    this.previousButtonClick = this.previousButtonClick.bind(this);
    this.nextButtonClick = this.nextButtonClick.bind(this);
    this.todayButtonClick = this.todayButtonClick.bind(this);
    this.template = this.template.bind(this);
  }

  template(schedules) {
    console.log("Template Schedules" + schedules)
  }
  // NavBar Click Previous Button
  previousButtonClick() {
    this.calendarRef.current.calendarInst.prev();
    this.setRenderRangeText();
  }

  // NavBar Click Next Button
  nextButtonClick() {
    this.calendarRef.current.calendarInst.next();
    this.setRenderRangeText();
  }

  // Nav Bar Click Today Button
  todayButtonClick() {
    this.calendarRef.current.calendarInst.today();
    this.setRenderRangeText();
  }

  // Before Create schedules Set up
  // Display schedules on Calendar
  // Update State
  onBeforeCreateSchedule(scheduleData) {
    const newSchedule = {
      id: String(Math.random()),
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
        .then(() => this.props.history.push("/calendar"))
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
          schedules: res.data,
          initialDisabled: res.data.length === 0 ? true : false
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
    const { schedules, calendars, renderRange, initialDisabled } = this.state;

    function _getFormattedTime(time) {
      const date = new Date(time);
      const h = date.getHours();
      const m = date.getMinutes();

      return `${h}:${m}`;
    }

    function _getTimeTemplate(schedule, isAllDay) {
      var html = [];

      if (!isAllDay) {
        html.push("<strong>" + _getFormattedTime(schedule.start) + "</strong> ");
      }
      if (schedule.isPrivate) {
        html.push('<span class="calendar-font-icon ic-lock-b"></span>');
        html.push(" Private");
      } else {
        if (schedule.isReadOnly) {
          html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
        } else if (schedule.recurrenceRule) {
          html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
        } else if (schedule.attendees.length) {
          html.push('<span class="calendar-font-icon ic-user-b"></span>');
        } else if (schedule.location) {
          html.push('<span class="calendar-font-icon ic-location-b"></span>');
        }
        html.push(" " + schedule.title);
      }

      return html.join("");
    }

    const templates = {
      time: function (schedule) {
        return _getTimeTemplate(schedule, false);
      }
    };
    return (
      <div>
        {/* Display description */}
        <span className="description">
          All schedules save when click 'Save Schedules' Button
        </span>

        {/* Calendar NavBar Display */}
        <CalendarNavBar
          renderText={renderRange}
          backClick={this.previousButtonClick}
          nextClick={this.nextButtonClick}
          todayClick={this.todayButtonClick}
        />

        {/* Toast UI Calendar Component */}
        <TUICalendar
          height="450px"
          view="week"
          taskView={false}
          scheduleView={true}
          ref={this.calendarRef}
          schedules={schedules}
          calendars={calendars}
          template={templates}
          useCreationPopup={true}
          useDetailPopup={true}
          disableClick={true}
          onBeforeCreateSchedule={this.onBeforeCreateSchedule}
          onBeforeUpdateSchedule={this.onBeforeUpdateSchedule}
          onBeforeDeleteSchedule={this.onBeforeDeleteSchedule}
        />

        {/* Save Schedules Button */}
        <Button
          decorate={"mt-4 btn btn-primary float-right"}
          onClick={this.handleSaveSchedule}
          text="Save Schedules"
          disabled={schedules.length === 0 && initialDisabled && "disabled"}
        />
      </div>
    );
  }
}

export default TuiCalendar;