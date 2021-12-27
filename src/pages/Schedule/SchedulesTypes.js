import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class SchedulesTypes extends Component {
  render() {
    return (
      <div>
        <Link
          to="/calendar"
          className="btn btn-primary text-uppercase header-btn mr-4"
        >
          Bulk Save
        </Link>
        <Link
          to="/scheduleTwo"
          className="btn btn-primary text-uppercase header-btn mr-4"
        >
          Single Save
        </Link>
      </div>
    )
  }
}

export default SchedulesTypes
