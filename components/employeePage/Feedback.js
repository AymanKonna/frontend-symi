/* eslint-disable react/prop-types */
export default class Feedback extends React.Component {
  constructor() {
    super();
    this.state = {
      feeling: null,
      about: { type: null, input: null },
      note: null
    };
  }

  searchEmployee = event => {
    this.setState({
      about: {
        type: this.state.about.type,
        input: event.target.value
      }
    });
  };

  handleInputChange = event => {
    console.log("event.target.name = ", event.target.name);
    if (event.target.name === "About") {
      this.setState({
        about: {
          type: event.target.value,
          input: null
        }
      });
    } else if (
      event.target.name === "Employee" ||
      event.target.name === "Category"
    ) {
      this.setState({
        about: {
          type: this.state.about.type,
          input: event.target.value
        }
      });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    // if all fields aren't filled out, send error message
    this.props.submitFeedback(this.state);
  };

  render() {
    return (
      <form>
        <div>
          <label>I FEEL </label>
          <select name="feeling" onChange={this.handleInputChange}>
            <option name="feeling" value="good">
              😊
            </option>
            <option name="feeling" value="okay">
              😐
            </option>
            <option name="feeling" value="bad">
              😞
            </option>
          </select>
        </div>

        <div>
          <label>ABOUT </label>
          {/* 1st ABOUT SELECTION */}
          <select name="About" onChange={this.handleInputChange}>
            <option>--- select ---</option>
            <option value="Employee">Employee</option>
            <option value="Category">Category</option>
          </select>

          {/* 2nd ABOUT > EMPLOYEE SEARCH */}
          {this.state.about.type === "Employee" ? (
            <input type="text" onChange={this.searchEmployee}></input>
          ) : (
            <div></div>
          )}

          {/* 2nd ABOUT > CATEGORY */}
          {this.state.about.type === "Category" ? (
            <select name="Category" onChange={this.handleInputChange}>
              <option>Work/Life Balance</option>
              <option>Benefits</option>
              <option>Holidays</option>
              <option>Job Satisfaction</option>
              <option>Company Policy</option>
              <option>Other</option>
            </select>
          ) : (
            <div></div>
          )}
          {/* CATEGORY SELECT */}
        </div>

        <div>
          <label>BECAUSE </label>
          <input
            type="text"
            name="note"
            value={this.state.note}
            onChange={this.handleInputChange}
          ></input>
        </div>

        <button type="submit" onClick={this.handleSubmit}>
          SUBMIT
        </button>
      </form>
    );
  }
}