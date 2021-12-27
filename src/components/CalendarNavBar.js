import React, { Component } from 'react'
import Button from '../atoms/Button';

class CalendarNavBar extends Component {
  render() {
    const { renderText, backClick, nextClick, todayClick } = this.props;
    return (
      <div className="p-3">
        {/* Previous days button */}
        <Button
          decorate={"btn btn-default btn-sm move-day"}
          onClick={backClick}
          text={[<i key="id" className="calendar-icon ic-arrow-line-left"></i>]}
        />

        {/* Display range in a week */}
        <span id="renderRange" className="render-range">
          {renderText}
        </span>

        {/* Next Days Button */}
        <Button
          decorate={"btn btn-default btn-sm move-day"}
          onClick={nextClick}
          text={[<i key="id" className="calendar-icon ic-arrow-line-right"></i>]}
        />

        {/* Today button */}
        <Button
          decorate={"btn btn-default btn-sm move-today float-right"}
          text="Today"
          onClick={todayClick}
        />
      </div>
    )
  }
}

export default CalendarNavBar
