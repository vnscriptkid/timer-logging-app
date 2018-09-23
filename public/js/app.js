class Timer extends React.Component {
  componentDidMount() {
    this.updateTimer = setInterval(() => this.forceUpdate(), 50);
  }

  componentWillUnmount() {
    clearInterval(this.updateTimer);
  }

  handleTriggerClick = id => {
    this.props.onStartStopTimer(id);
  };

  render() {
    const {
      title,
      project,
      elapsed,
      runningSince,
      toggle,
      onRemoveClick,
      id,
      onTimerStart
    } = this.props;
    const startOrStop = runningSince ? "Stop" : "Start";
    const elapsedString = helpers.renderElapsedString(elapsed, runningSince);
    return (
      <div className="timer">
        <div className="timer--padding-20">
          <div className="timer__title">{title}</div>
          <div className="timer__project">{project}</div>
          <div className="timer__elapsed">{elapsedString}</div>
          <div className="timer__functions">
            <i className="fas fa-trash-alt" onClick={() => onRemoveClick(id)} />
            <i className="fas fa-pencil-alt" onClick={toggle} />
          </div>
        </div>
        <button
          onClick={() => this.handleTriggerClick(id)}
          className="btn btn--blue btn--bl-radius btn--br-radius"
        >
          {startOrStop}
        </button>
      </div>
    );
  }
}

class TimerForm extends React.Component {
  state = {
    title: this.props.title || "",
    project: this.props.project || ""
  };

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    const { id, onFormSubmit } = this.props;
    const { title, project } = this.state;
    onFormSubmit({ id, title, project });
  };

  render() {
    const { toggle, onFormSubmit } = this.props;
    const { title, project } = this.state;
    const submitText = this.props.id ? "Update" : "Create";
    return (
      <div className="timer timer--padding-20">
        <div className="timer__form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            name="title"
            onChange={this.handleInputChange}
          />
        </div>
        <div className="timer__form-group">
          <label>Project</label>
          <input
            type="text"
            value={project}
            name="project"
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <button
            className="btn btn--half btn--blue btn--bl-radius"
            onClick={this.handleSubmit}
          >
            {submitText}
          </button>
          <button
            onClick={toggle ? toggle : null}
            className="btn btn--half btn--red btn--br-radius"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

class EditableTimer extends React.Component {
  state = {
    editFormOpen: false
  };

  toggleEditForm = () => {
    this.setState({ editFormOpen: !this.state.editFormOpen });
  };

  handleFormSubmit = timer => {
    this.props.onFormSubmit(timer);
    this.toggleEditForm();
  };

  render() {
    const {
      title,
      project,
      elapsed,
      runningSince,
      id,
      onFormSubmit,
      onRemoveClick,
      onStartStopTimer
    } = this.props;
    const { editFormOpen } = this.state;
    return editFormOpen ? (
      <TimerForm
        id={id}
        title={title}
        project={project}
        toggle={this.toggleEditForm}
        onFormSubmit={this.handleFormSubmit}
      />
    ) : (
      <Timer
        id={id}
        title={title}
        project={project}
        elapsed={elapsed}
        runningSince={runningSince}
        toggle={this.toggleEditForm}
        onRemoveClick={onRemoveClick}
        onStartStopTimer={onStartStopTimer}
      />
    );
  }
}

class EditableTimerList extends React.Component {
  render() {
    const {
      timers,
      onFormSubmit,
      onRemoveClick,
      onStartStopTimer
    } = this.props;
    return (
      <div>
        {timers.map(({ id, title, project, elapsed, runningSince }) => (
          <EditableTimer
            key={id}
            id={id}
            title={title}
            project={project}
            elapsed={elapsed}
            runningSince={runningSince}
            onFormSubmit={onFormSubmit}
            onRemoveClick={onRemoveClick}
            onStartStopTimer={onStartStopTimer}
          />
        ))}
      </div>
    );
  }
}

class TogglableTimerForm extends React.Component {
  state = {
    isOpen: false
  };

  toggleTimerForm = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { isOpen } = this.state;
    return (
      <div>
        {!isOpen ? (
          <div>
            <i
              className="fas fa-plus-circle"
              style={{
                color: "blue",
                fontSize: "150%",
                cursor: "pointer",
                marginBottom: 20
              }}
              onClick={this.toggleTimerForm}
            />
          </div>
        ) : (
          <TimerForm
            toggle={this.toggleTimerForm}
            onFormSubmit={this.props.onFormSubmit}
          />
        )}
      </div>
    );
  }
}

class TimerDashboard extends React.Component {
  state = {
    timers: [
      {
        title: "Practice squat",
        project: "Gym Chores",
        id: uuid.v4(),
        elapsed: 5456099,
        runningSince: Date.now()
      },
      {
        title: "Bake squash",
        project: "Kitchen Chores",
        id: uuid.v4(),
        elapsed: 1273998,
        runningSince: null
      }
    ]
  };

  handleEditFormSubmit = timer => {
    this.updateTimer(timer);
  };

  updateTimer = timer => {
    this.setState({
      timers: this.state.timers.map(
        c => (c.id === timer.id ? Object.assign({}, c, timer) : c)
      )
    });
  };

  handleRemoveTimer = id => {
    this.removeTimer(id);
  };

  removeTimer = id => {
    this.setState({
      timers: this.state.timers.filter(timer => timer.id !== id)
    });
  };

  handleCreateFormSubmit = timer => {
    this.addTimer(timer);
  };

  addTimer = timer => {
    const newTimer = helpers.newTimer(timer);
    this.setState({
      timers: [...this.state.timers, newTimer]
    });
  };

  handleStartStopTimer = id => {
    this.startStopTimer(id);
  };

  startStopTimer = id => {
    this.setState({
      timers: this.state.timers.map(timer => {
        if (timer.id === id) {
          if (!timer.runningSince) {
            return Object.assign({}, timer, { runningSince: Date.now() });
          } else {
            return Object.assign({}, timer, {
              runningSince: null,
              elapsed: timer.elapsed + (Date.now() - timer.runningSince)
            });
          }
        } else {
          return timer;
        }
      })
    });
  };

  render() {
    return (
      <div>
        <h1 className="heading">Timers</h1>
        <hr />
        <div className="row">
          <TogglableTimerForm onFormSubmit={this.handleCreateFormSubmit} />
          <EditableTimerList
            timers={this.state.timers}
            onFormSubmit={this.handleEditFormSubmit}
            onRemoveClick={this.handleRemoveTimer}
            onStartStopTimer={this.handleStartStopTimer}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<TimerDashboard />, document.getElementById("app"));
