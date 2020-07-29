import React, { useState, useEffect } from 'react';
import {
    Form, Row, Col
} from 'react-bootstrap'

let DatePicker = (props) => {

    const thisDay = new Date();
    const thisYear = thisDay.getFullYear();

    let [day, setDay] = useState(thisDay.getDate());
    let [month, setMonth] = useState(thisDay.getMonth());
    let [year, setYear] = useState(thisYear);

    let [daySelection, setDaySelection] = useState(null);
    let [monthSelection, setMonthSelection] = useState(null);
    let [yearSelection, setYearSelection] = useState(null);

    const defaultYearsAhead = 20;

    let calcDays = () => {
        // this month date object
        let _date = new Date(year, parseInt(month, 10) + 1, 0);
        let days = []
        for (let d = 1; d <= _date.getDate(); d++) {
            days.push(d);
        }
        setDaySelection(days);
    }

    useEffect(() => {
        calcDays();

        let months = [];
        for (let m = 0; m < 12; m++) {
            let date = new Date(thisYear, m, 1);
            months.push({
                val: m,
                label: date.toLocaleString('default', { month: 'long' })
            })
        }
        setMonthSelection(months);

        let years = [];
        for (let y = thisYear; y <= thisYear + defaultYearsAhead; y++) {
            years.push(y);
        }
        setYearSelection(years)
    }, [])

    useEffect(() => {
        calcDays();
    }, [month, year])

    useEffect(() => {
        if (props.dateChanged) {
            props.dateChanged(
                new Date(
                    parseInt(year, 10),
                    parseInt(month, 10),
                    parseInt(day, 10)
                )
            )
        }
    }, [day, month, year])

    return (
        <Form.Group>
            {
                props.label ?
                    <Row>
                        <Col>
                            <span className="date-picker-label">{props.label}</span>
                        </Col>
                    </Row> : null
            }
            <Row>
                <Col>
                    <Form.Control
                        as="select"
                        onChange={(evt) => setDay(evt.target.value)}
                        value={day}
                    >
                        {
                            daySelection ? daySelection.map(d => {
                                return <option key={d} value={d}>{d}</option>
                            }) : null
                        }
                    </Form.Control>
                </Col>
                <Col>
                    <Form.Control
                        as="select"
                        onChange={(evt) => setMonth(evt.target.value)}
                        value={month}
                    >
                        {
                            monthSelection ? monthSelection.map(m => {
                                return <option key={m.val} value={m.val}>{m.label}</option>
                            }) : null
                        }
                    </Form.Control>
                </Col>
                <Col>
                    <Form.Control
                        as="select"
                        onChange={(evt) => setYear(evt.target.value)}
                        value={year}
                    >
                        {
                            yearSelection ? yearSelection.map(y => {
                                return <option key={y} value={y}>{y}</option>
                            }) : null
                        }
                    </Form.Control>
                </Col>
            </Row>
        </Form.Group>

    )
}

export default DatePicker;