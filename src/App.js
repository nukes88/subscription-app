import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import {
  Row, Col, Container, Form, Alert, Button, Spinner
} from 'react-bootstrap'

import DatePicker from './components/DatePicker';
import './App.css';;



let App = () => {

  const subscriptionTypes = [
    { val: 'd', label: 'DAILY' },
    { val: 'w', label: 'WEEKLY' },
    { val: 'm', label: 'MONTHLY' }
  ];
  let [selectedSubscriptionType, setSelectedSubscriptionType] = useState('d');

  let [amount, setAmount] = useState(0.0);
  let handleAmountChange = (evt) => {
    let _amount = parseFloat(parseFloat(evt.target.value).toFixed(2));
    setAmount(_amount ? _amount : 0)
  }

  let [daysOfWeek, setDaysOfWeek] = useState([]);
  let [dayOfWeek, setDayOfWeek] = useState(daysOfWeek[0]);
  let [dayOfMonth, setDayOfMonth] = useState(1);

  let [periodStartDate, setPeriodStartDate] = useState(null);
  let [periodEndDate, setPeriodEndDate] = useState(null);

  let handleSubscriptionTypeChange = (evt) => {
    setSelectedSubscriptionType(evt.target.value);
  }

  useEffect(() => {
    let daysInAWeek = 7;
    let daysArr = [];
    let date = new Date();
    for (let i = 0; i < daysInAWeek; i++) {
      daysArr.push({
        val: date.getDay(),
        label: date.toLocaleString('default', { weekday: 'long' })
      })
      date.setDate(date.getDate() + 1)
    }
    setDaysOfWeek(daysArr);
    setDayOfWeek(daysArr[0].val)
  }, [])

  useEffect(() => {
    if (selectedSubscriptionType === 'w' ||
      selectedSubscriptionType === 'm') {
    }
  }, [selectedSubscriptionType])

  let handleDayOfWeekChange = (evt) => {
    console.log(evt.target.value)
    setDayOfWeek(evt.target.value);
  }

  let handleDayOfMonthChange = (evt) => {
    setDayOfMonth(evt.target.value);
  }

  let daysOfMonth = () => {
    let options = [];
    for (let day = 1; day <= 31; day++) {
      options.push(<option key={day} val={day}>{day}</option>)
    }
    return options;
  }

  useEffect(() => {
    if (periodStartDate) {
      // console.log('start date', periodStartDate)
    }
    if (periodEndDate) {
      // console.log('end date', periodEndDate);
    }
  }, [periodStartDate, periodEndDate])

  let [errMsg, setErrMsg] = useState(null);
  let [sucMsg, setSucMsg] = useState(null);

  let [isLoading, setIsLoading] = useState(false);

  let handleCreateClicked = () => {
    setErrMsg(null);

    if (amount < 1) {
      setErrMsg("Are you sure to subscribe for less than RM1?")

      return false;
    }

    let diffTime = periodEndDate.getTime() - periodStartDate.getTime();
    let diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 90) {
      setErrMsg("Subscribe for so long?")
      return false;
    }


    let data = {
      amount: amount,
      type: selectedSubscriptionType,
      subDay: selectedSubscriptionType === 'w' ? dayOfWeek : selectedSubscriptionType === 'm' ? dayOfMonth : null,
      subStart: {
        y: periodStartDate.getFullYear(),
        m: periodStartDate.getMonth(),
        d: periodStartDate.getDate()
      },
      subEnd: {
        y: periodEndDate.getFullYear(),
        m: periodEndDate.getMonth(),
        d: periodEndDate.getDate()
      },
      timezoneOffset: new Date().getTimezoneOffset()
    }
    console.log('submit data', data);

    setIsLoading(true);
    fetch("http://localhost:3001/create-sub", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          console.error('response error')
        }
      })
      .then(pRes => {
        console.log(pRes);
        let result = <div>
          <div>Amount: {pRes.amount}</div>
          <div>Type: {subscriptionTypes.filter(t => t.val === pRes.type)[0].label}</div>
          <div>Invoice dates: <ol>{pRes.invoices.map(i => { return <li>{i}</li> })}</ol></div>
        </div>
        setSucMsg(result);

      })
      .catch(err => {
        setErrMsg(err)
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  useEffect(() => {
    if (errMsg) {
      setTimeout(() => {
        setErrMsg(null)
      }, 2500)
    }
  }, [errMsg])

  useEffect(() => {
    if (sucMsg) {
      setTimeout(() => {
        setSucMsg(null)
      }, 5000)
    }
  }, [sucMsg])


  return (
    <Container>
      <Row>
        <Col>
          <h1>Create a subscription</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Alert show={errMsg !== null} variant="danger">{errMsg}</Alert>
        </Col>
      </Row>
      <Row>
        <Col>
          <Alert show={sucMsg !== null} variant="success">{sucMsg}</Alert>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form>
            <Form.Group>
              <Form.Label>Amount (RM):</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={handleAmountChange}
              ></Form.Control>
              <Form.Text>Number with 2 decimal places</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Type:</Form.Label>
              <Form.Control
                as="select"
                onChange={handleSubscriptionTypeChange}
                value={selectedSubscriptionType}
              >
                {subscriptionTypes.map(s => {
                  return <option key={s.val} value={s.val}>{s.label}</option>
                })
                }
              </Form.Control>
            </Form.Group>
            {
              selectedSubscriptionType && selectedSubscriptionType !== 'd' ?
                <Form.Group>
                  <Form.Label>Day of {selectedSubscriptionType === 'w' ? 'week' : selectedSubscriptionType === 'm' ? 'month' : ''}:</Form.Label>
                  {
                    selectedSubscriptionType === 'w' ?
                      <Form.Control
                        as="select"
                        onChange={handleDayOfWeekChange}
                        value={dayOfWeek}
                      >
                        {
                          daysOfWeek.map((d) => {
                            return <option key={d.val} value={d.val}>{d.label}</option>
                          })
                        }
                      </Form.Control> : null
                  }
                  {
                    selectedSubscriptionType === 'm' ? <React.Fragment>
                      <Form.Control
                        as="select"
                        onChange={handleDayOfMonthChange}
                        value={dayOfMonth}
                      >
                        {
                          daysOfMonth()
                        }
                      </Form.Control>
                      <Form.Text><b>NOTE:</b> Will use last day of month if date is not available</Form.Text> </React.Fragment> : null
                  }
                </Form.Group> : null
            }
            <Form.Group>
              <Form.Label>Period:</Form.Label>
              <DatePicker
                label="Start"
                dateChanged={setPeriodStartDate}
              />
              <DatePicker
                label="End"
                dateChanged={setPeriodEndDate}
              />
            </Form.Group>
            {
              isLoading ? <Spinner animation="border" /> : <Button
                type="button"
                variant="primary"
                onClick={handleCreateClicked}
              >Create</Button>
            }

          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
