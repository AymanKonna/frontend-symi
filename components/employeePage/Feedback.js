/* eslint-disable react/prop-types */
import React from 'react';

import PointsKey from './PointsKey';

//components
import { Autocomplete } from '@material-ui/lab';
import {
  Slider,
  Select,
  TextField,
  Button,
  FormControl,
  FormHelperText
} from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

//util functions
import { feedbackValidation, debounce } from '../../utils/utils';
import moment from 'moment';

//images
import Loader from '../../assets/loader_img.gif';
import reward from '../../assets/reward.png';

// material ui
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

//context API
import EmployeeContext from '../../contextApi/EmployeeContext';

//feelings data
const feelings = [
  {
    value: 100,
    label: ' 😊'
  },
  {
    value: 50,
    label: '😐'
  },
  { value: 0, label: '😞' }
];


export default class Feedback extends React.Component {
  static contextType = EmployeeContext;

  constructor() {
    super();
    this.state = {
      feeling: 'good',
      about: '',
      input: '',
      note: '',
      news: '',
      status: false,
      feedbackValidation: {
        result: false,
        errors: {
          note: { isShown: false, message: '' },
          about: { isShown: false, message: '' },
          input: { isShown: false, message: '' }
        }
      },
      isPopupOpen: false
    };
  }

  componentDidMount() {
    if (this.context.newsFeedback) {
      this.setState({ about: 'News', input: this.context.newsFeedback.title, news: this.context.newsFeedback });
      this.context.handleResetNewsFeedback();
    }
  }

  //make an API call to DB to get employees
  update = debounce(async () => {
    await this.context.handleFuzzyNameSearch(this.state.input);
    this.setState({ isPopupOpen: true });
  }, 500);

  handleInputChange = event => {
    //for because & about input field
    this.setState({ [event.target.name]: event.target.value });
  };

  handleEmployeeNameInput = event => {
    this.setState({ input: event.target.value });
    this.update();
  };

  handleNewsTopicInput = event => {
    this.setState({ input: event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();

    // send feedback object
    const validation = feedbackValidation({
      about: this.state.about,
      note: this.state.note,
      input: this.state.input
    });

    if (validation.result) {
      this.setState({ feedbackValidation: validation });
    } else {
      const newFeedback = {
        feeling: this.state.feeling,
        category: this.state.about,
        note: this.state.note,
        recipientId: this.state.about === 'Employee' ? this.state.input : '',
        newsId: this.state.about === 'News' ? this.context.news.find(news => news.title.toLowerCase().includes(this.state.input.toLowerCase())).newsId : 0
      };
      this.context.submitFeedback(newFeedback);
      this.setState({ about: '', note: '', input: '' });
    }
  };

  handleFeelingInput = (event, value) => {
    let feeling = '';
    if (value === 0) {
      feeling = 'sad';
    } else if (value === 50) {
      feeling = 'meh';
    } else if (value === 100) {
      feeling = 'good';
    }
    this.setState({ feeling });
  };

  searchEmployee = (event, value) => {
    //change input value to the employee id
    //TODO for version 2.0 write logic to add newsId depending on the category
    if (this.state.isPopupOpen) {
      this.setState({ input: value.employeeId, isPopupOpen: false });
    } else {
      //clear the input and re-render employee name input field
      this.setState({ input: '' });
      this.context.deleteFuzzyNames();
    }
  };

  render() {
    return (
      <div>
        <div id="feedback-container">
          <div>
            <p className="title">Submit Feedback</p>
            <form className="feedback-submit">
              <div className="about-line">
                <div className="feedback-text">I FEEL</div>
                <Slider className="slider"
                  style={{ width: 220 }}
                  defaultValue={100}
                  aria-labelledby="discrete-slider-restrict"
                  step={50}
                  marks={feelings}
                  onChange={this.handleFeelingInput}
                />
              </div>

              <div className="about-line">
                <div className="feedback-text">ABOUT</div>

                <FormControl
                  error={this.state.feedbackValidation.errors.about.isShown}
                >
                  <Select
                    name="about"
                    native
                    onChange={this.handleInputChange}
                    style={{ width: 220 }}
                    value={this.state.about}
                  >
                    <option value="" />
                    <option value="Employee">Employee</option>
                    <option value="News">News</option>
                    <option value="Work/Life Balance">Work/Life Balance</option>
                    <option value="Benefits">Benefits</option>
                    <option value="Holidays">Holidays</option>
                    <option value="Job Satisfaction">Job Satisfaction</option>
                    <option value="Company Policy">Company Policy</option>
                    <option value="Other">Other</option>
                  </Select>
                  {this.state.feedbackValidation.errors.about.message ? (
                    <FormHelperText id="my-helper-text">
                      {this.state.feedbackValidation.errors.about.message}
                    </FormHelperText>
                  ) : null}

                  {(this.state.about === 'Employee' &&
                    this.context.fuzzyNames === '') ? (
                      <TextField
                        error={this.state.feedbackValidation.errors.input.isShown}
                        helperText={
                          this.state.feedbackValidation.errors.input.message
                        }
                        id="outlined"
                        margin="normal"
                        name="input"
                        placeholder={
                          this.state.about === 'Employee'
                            ? 'Please specify employee name'
                            : 'Please enter news topic'
                        }
                        value={this.state.input}
                        onChange={this.handleEmployeeNameInput}
                      ></TextField>
                    ) : null}
                  {
                    (this.state.about === 'News' &&
                       this.context.fuzzyNames === '') ? <TextField
                        error={this.state.feedbackValidation.errors.input.isShown}
                        helperText={
                          this.state.feedbackValidation.errors.input.message
                        }
                        id="outlined"
                        margin="normal"
                        name="input"
                        placeholder='Please enter news topic'
                        value={this.state.input}
                        onChange={this.handleNewsTopicInput}
                      ></TextField> : null}
                  {this.context.fuzzyNames ? (
                    <Autocomplete
                      options={this.context.fuzzyNames}
                      getOptionLabel={option => {
                        return `${option.name} (${option.department})`;
                      }}
                      open={this.state.isPopupOpen}
                      style={{ width: 220 }}
                      onChange={this.searchEmployee}
                      renderInput={params => (
                        <TextField
                          label="Select Employee"
                          {...params}
                          fullWidth
                        />
                      )}
                    />
                  ) : null}
                </FormControl>
              </div>

              <div className="about-line">
                <span className="feedback-text">BECAUSE</span>
                <TextField
                  error={this.state.feedbackValidation.errors.note.isShown}
                  helperText={this.state.feedbackValidation.errors.note.message}
                  id="outlined"
                  margin="normal"
                  name="note"
                  onChange={this.handleInputChange}
                  value={this.state.note}
                  style={{ width: 220 }}
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
            </form>
          </div>

          <div>
            <p className="title">Get Points</p>
            <div className="feedback-submit">
              <PointsKey />
            </div>

            <div className="title">Quarterly Prize <div className="tooltip">
              <HelpOutlineIcon style={{fontSize: '15px', color: 'black'}}></HelpOutlineIcon>
              <span className="tooltiptext">Reach {this.context.prizeForPoints.points ? this.context.prizeForPoints.points : null}⭐ to be eligible for the quarterly prize! Once eligible, HR will contact you.</span>
            </div>
            </div>
            <div className="feedback-submit">
              <div>

                <img className="prize" src={this.context.prizeForPoints.url ? this.context.prizeForPoints.url : null} ></img>
                <table id="reward">
                  <tr>
                    <th className="points">{this.context.prizeForPoints.points ? this.context.prizeForPoints.points : null}⭐</th>
                    <th className="points-desc">{this.context.prizeForPoints.name ? this.context.prizeForPoints.name.toUpperCase() : null}</th>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>

        <p className="title">Feedback History</p>

        <div className="feedback-history-sub">
          <span>DETAILS ▾</span>
          <span className="status">STATUS ▾</span>
        </div>
        {this.context.feedbacks ? (
          this.context.feedbacks.map(item => {
            return (
              <div key={item.id} className="feedback-history">
                <span className="feedback">
                  I feel{' '}
                  {' ' + item.feeling.toLowerCase() + ' '}
                  about
                  {' ' +
                    (item.category === 'Employee' ? item.name : item.category) +
                    ' '}
                  because {item.note}.
                  <span className="date"> SENT » {moment(item.dateAdded).format('MM/DD/YYYY')}</span>
                </span>
                <div className="status">
                  <div>
                    {!item.status ? (
                      <HighlightOffIcon style={{ color: 'red' }} />
                    ) : (
                      <CheckCircleOutlineIcon style={{ color: 'green' }} />
                    )}
                  </div>
                  <div> {item.status ? 'Seen' : 'Unseen'}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="feedback-history">
            <img className="loader" src={Loader}></img>
          </div>
        )}
      </div>
    );
  }
}
