import React from "react";
import Header from "./Header/Header";
import icon_clock from "../assets/images/icon-clock.png";
import icon_clock_bold from "../assets/images/icon-clock-bold.png";
import icon_calendar from "../assets/images/icon-calendar.png";
import icon_close from "../assets/images/icon-close.png";
import icon_tick from "../assets/images/icon-tick.png";
import DatePicker from "react-datepicker";

class Content extends React.Component {
  constructor() {
    super();

    this.state = {
      taskName: '',
      time: '00:00',
      isAddTimeDrawerOpen: false,
      isNotificationDrawerOpen: false,
      isActivityInfoOpen: false,
      startDate: new Date(),
      selectedDate: "",
      tasks: [
        {
          "name": "Artwork Poster",
          "status": "cancelled",
          "description": "Task details will come here..."
        },
        {
          "name": "Design Homepage",
          "status": "cancelled",
          "description": "Task details will come here..."
        },
        {
          "name": "Photoshoot Prep",
          "status": "inprogress",
          "description": "Task details will come here..."
        },
        {
          "name": "Development Work",
          "status": "inprogress",
          "description": "Task details will come here..."
        },
        {
          "name": "Client Meeting",
          "status": "inprogress",
          "description": "Task details will come here..."
        }
      ],
      activeIndex: null
    };

    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleAddTimeDrawerOpen = this.handleAddTimeDrawerOpen.bind(this);
    this.handleSetDate = this.handleSetDate.bind(this);
    this.handleAddTimeClose = this.handleAddTimeClose.bind(this);
    this.handleNotificationsDrawerOpen = this.handleNotificationsDrawerOpen.bind(this);
    this.handleShowActivityInfo = this.handleShowActivityInfo.bind(this);
    this.handleActiveTask = this.handleActiveTask.bind(this);
    this.renderTaskList = this.renderTaskList.bind(this);
    this.isStarted = false;
	  this.intervalTimer = null;
  }

	hmsToSecondsOnly = (str) => {
		var p = str.split(':'),
			s = 0, m = 1;
		while (p.length > 0) {
			s += m * parseInt(p.pop(), 10);
			m *= 60;
		}
		return s;
	}

  handleTaskNameChange = (event) => {
    const taskName = event.target.value;
    this.setState({ taskName: taskName });
  }

  handleNotificationsDrawerOpen = () => {
    this.setState({ isNotificationDrawerOpen: !this.state.isNotificationDrawerOpen });
  }

  handleShowActivityInfo = () => {
    this.setState({ isActivityInfoOpen: !this.state.isActivityInfoOpen });
  }

  handleActiveTask(index) {
    this.setState({ activeIndex: index });
  }

  renderTaskList(el, index) {
    return <li key={index}
               className={this.state.activeIndex === index ? "task-info-sec__status--" + el.status + " active" : "task-info-sec__status--" + el.status}
               onClick={this.handleActiveTask.bind(this, index)}>
      {el.name}
      <div className="task-info-sec__description">
        {el.description}
      </div>
    </li>;
  }

  handleTimeChange = (time) => {
    const timeInput = document.getElementById("setTime");
    const currentTime = timeInput.value;

    this.setState({ time: currentTime });
  }

  handleAddTimeDrawerOpen = () => {
    this.setState({
      isAddTimeDrawerOpen: true
    });
  }

  handleSetDate = (e) => {
    const seconds = this.hmsToSecondsOnly(this.state.time);

    let progressBar = document.querySelector('.task__timer-progress');
    let pointer = document.getElementById('task__timer-pointer');
    let length = Math.PI * 2 * 100;
    progressBar.style.strokeDasharray = length;

    const displayOutput = document.querySelector('.task__controls-remain-time');
    this.timer(seconds, 0, seconds, length, progressBar, pointer, displayOutput);
    this.isStarted = true;
    if(this.isStarted == true && this.state.time != "00:00"){
      document.getElementsByClassName('task__controls-checkmark')[0].style.opacity = 1;
    }

    const selectedDate = this.state.startDate.toString().slice(4,15);

    this.setState({
      isAddTimeDrawerOpen: false,
      selectedDate: selectedDate
    });
  }

  handleAddTimeClose = () => {
    this.setState({
      isAddTimeDrawerOpen: false
    });
  }

  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  update = (value, timePercent, length, progressBar, pointer) => {
    let offset = -length - length * value / (timePercent);
    progressBar.style.strokeDashoffset = offset;
    pointer.style.transform = `rotate(${360 * value / (timePercent)}deg)`;
  };

  displayTimeLeft = (timeLeft, wholeTime, length, progressBar, pointer, displayOutput) => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    displayOutput.textContent = displayString;
    this.update(timeLeft, wholeTime, length, progressBar, pointer);
  }

	timer = (seconds, timeLeft, wholeTime, length, progressBar, pointer, displayOutput) => {
		let remainTime = Date.now() + (seconds * 1000);
		this.displayTimeLeft(seconds, wholeTime, length, progressBar, pointer, displayOutput);
		if(this.intervalTimer) {
			clearInterval(this.intervalTimer);
		}
		this.intervalTimer = setInterval(() => {
			timeLeft = Math.round((remainTime - Date.now()) / 1000);
			if (timeLeft < 0) {
				clearInterval(this.intervalTimer);
				this.isStarted = false;
				this.displayTimeLeft(wholeTime, wholeTime, length, progressBar, pointer, displayOutput);
				return;
			}
			this.displayTimeLeft(timeLeft, wholeTime, length, progressBar, pointer, displayOutput);
		}, 1000);
	}

  componentDidMount() {
    let progressBar = document.querySelector('.task__timer-progress');
    let pointer = document.getElementById('task__timer-pointer');
    let length = Math.PI * 2 * 100;

    progressBar.style.strokeDasharray = length;

    const displayOutput = document.querySelector('.task__controls-remain-time');

    let timeLeft;
    let wholeTime = 0 * 60;

    this.update(wholeTime, wholeTime, length, progressBar, pointer);
    this.displayTimeLeft(wholeTime, wholeTime, length, progressBar, pointer, displayOutput);
  }


  render() {
    const { time } = this.state;

    return (
      <main>
        <Header isDrawerOpen={this.state.isNotificationDrawerOpen}
                handleNotificationsDrawerOpen={this.handleNotificationsDrawerOpen}/>
        <section className="task">
          <input className="task__name" type="text" placeholder="Type task name" autofocus="true"
                 onChange={this.handleTaskNameChange}/>
          <div className="task__timer">
            <div className="task__timer-circle">
              <svg width="260" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(110,110)">
                  <circle r="100" className="task__timer-base"/>
                  <g transform="rotate(-90)">
                    <circle r="100" className="task__timer-progress"/>
                    <g id="task__timer-pointer">
                      <circle cx="100" cy="0" r="5" className="task__timer-pointer"/>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <div className="task__controls">
              <div className="task__controls-remain-time"></div>
              <div className="task__controls-icon"><img src={icon_clock} alt="Time"/></div>
              <div className="app-btn success task__controls-checkmark"><img src={icon_tick} alt="Tick" /></div>
            </div>
          </div>
          <button className="task__btn" onClick={this.handleAddTimeDrawerOpen}>Add Time <img src={icon_clock_bold}
                                                                                             alt="Add Time"/></button>
          <div className={this.state.isAddTimeDrawerOpen ? "drawer open" : "drawer"}>
            <div className="add-time-sec">
              <div className="add-time-sec__header">
                <input id="setTime" className="time-input" value={time} onChange={this.handleTimeChange} />
                <div className="app-btn calender-icon"><img src={icon_calendar} alt="Calendar"/></div>
              </div>
              <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChange}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                inline
              />

              <div className="add-time-sec__btns">
                <button type="button" className="app-btn success" onClick={this.handleSetDate}>Set Date</button>
                <button type="button" className="app-btn error" onClick={this.handleAddTimeClose}><img src={icon_close} alt="Close"/>
                </button>
              </div>
            </div>
          </div>

          <div className={this.state.isNotificationDrawerOpen ? "drawer open" : "drawer"}>
            <div className="task-info-sec">
              <label><span>Today's Activity</span></label>
              <ul>
                {(this.state.taskName) ?
                  <li className={this.state.isActivityInfoOpen ? "active" : ""} onClick={this.handleShowActivityInfo}>
                    {this.state.taskName}
                    <div className="task-info-sec__description">
                      <div>Date - {this.state.selectedDate}</div>
                      <div>Time - {this.state.time}</div>
                    </div>
                  </li>
                  :
                  <li className="no-activity">No activity yet! Please create a New Task.</li>
                }
              </ul>

              <label><span>Tasks</span></label>
              <ul>
                {this.state.tasks.map(this.renderTaskList)}
              </ul>
            </div>
          </div>
        </section>
      </main>
    )
  }
}

export default Content;
