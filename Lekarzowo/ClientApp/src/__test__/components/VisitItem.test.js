import VisitItem from '../../components/VisitItem.js';
import {shallow, mount, debug} from 'enzyme';
import {render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';

const visitDoctor = {
  reservationId: 1,
  isCanceled: false,
  reservationStartTime: new Date(2020,9,20,8,0).toISOString(),
  reservationEndTime: new Date(2020,9,20,8,30).toISOString(),
  localName: "Szpital Kliniczny",
  doctorSpecialization: "Kardiologia",
  patientName: "Bartosz",
  patientLastname: "Bartoszewski",
  roomNumber: 5
};

const visitPatient = {
  reservationId: 1,
  isCanceled: false,
  reservationStartTime: new Date(2020,9,20,8,0).toISOString(),
  reservationEndTime: new Date(2020,9,20,8,30).toISOString(),
  localName: "Szpital Kliniczny",
  doctorSpecialization: "Kardiologia",
  doctorName: "Andrzej",
  doctorLastname: "Andrzejewski",
  roomNumber: 5
};

const doctorRole = 'doctor';
const patientRole = 'patient';


it('renders', () => {
  shallow(<VisitItem visit = {visitPatient} />);
  shallow(<VisitItem visit = {visitDoctor} />);
});

it('accepts props', () => {
  var wrapper = mount(<VisitItem visit = {visitPatient} role = {patientRole}/>);
  expect(wrapper.props().visit.reservationId).toEqual(visitPatient.reservationId);
  expect(wrapper.props().visit.isCanceled).toEqual(visitPatient.isCanceled);
  expect(wrapper.props().visit.reservationStartTime).toEqual(visitPatient.reservationStartTime);
  expect(wrapper.props().visit.reservationEndTime).toEqual(visitPatient.reservationEndTime);
  expect(wrapper.props().visit.localName).toEqual(visitPatient.localName);
  expect(wrapper.props().visit.doctorSpecialization).toEqual(visitPatient.doctorSpecialization);
  expect(wrapper.props().visit.doctorName).toEqual(visitPatient.doctorName);
  expect(wrapper.props().visit.doctorLastname).toEqual(visitPatient.doctorLastname);
  expect(wrapper.props().visit.upcomingVisit).toEqual(visitPatient.upcomingVisit);
  expect(wrapper.props().role).toEqual(patientRole);
  wrapper = mount(<VisitItem visit = {visitDoctor} role = {doctorRole}/>);
  expect(wrapper.props().visit.patientName).toEqual(visitDoctor.patientName);
  expect(wrapper.props().visit.patientLastname).toEqual(visitDoctor.patientLastname);
  expect(wrapper.props().role).toEqual(doctorRole);
});

it('should hide Odwolaj button if the visit is not an upcoming one', () => {
  const {debug, queryByText} = render(<VisitItem visit = {visitDoctor} role = {doctorRole}
    upcomingVisit = {false}/>);
  var btnCancel = queryByText('Odwołaj');
  expect(btnCancel).toBeNull();
});

describe("Component functionality doctor view", () => {

  it('displays details', () => {
    const wrapper = mount(<VisitItem visit = {visitDoctor} role = {doctorRole} upcomingVisit = {true}/>);
    var value = wrapper.find("a").at(0).text();
    expect(value).toEqual(visitDoctor.reservationStartTime.split('T')[0]);
    value = wrapper.find("a").at(1).text();
    expect(value).toEqual("06:00 - 06:30");
    value = wrapper.find("a").at(2).text();
    expect(value).toEqual("Szpital Kliniczny");
    value = wrapper.find("a").at(3).text();
    expect(value).toEqual("Pokój: 5");
    value = wrapper.find("a").at(4).text();
    expect(value).toEqual("Bartosz Bartoszewski");
  });

  it('should call dialogCallback when clicked on Odwołaj button', () => {
    const mockedCallBack = jest.fn((visit,  event)  => {
      return visit
    });
    const {debug, getByText} = render(<VisitItem visit = {visitDoctor} role = {doctorRole} upcomingVisit = {true}
      dialogCallback = {mockedCallBack}/>);
    var btnCancel = getByText('Odwołaj');
    fireEvent.click(btnCancel);
    expect(mockedCallBack).toHaveBeenCalledTimes(1);
    expect(mockedCallBack.mock.calls[0][0]).toEqual({"doctorSpecialization": "Kardiologia", "isCanceled": false, "localName": "Szpital Kliniczny", "patientLastname": "Bartoszewski", "patientName": "Bartosz", "reservationEndTime": "2020-10-20T06:30:00.000Z", "reservationId": 1, "reservationStartTime": "2020-10-20T06:00:00.000Z", "roomNumber": 5});
  });

  it('should call history.push when clicked on Zobacz button', () => {
    const historyMock = { push: jest.fn((path) => {
      return path
    }) };
    const {debug, getByText} = render(<VisitItem visit = {visitDoctor} role = {doctorRole} upcomingVisit = {true}
      history = {historyMock}/>);
    var btnCancel = getByText('Zobacz');
    fireEvent.click(btnCancel);
    expect(historyMock.push).toHaveBeenCalledTimes(1);
    expect(historyMock.push.mock.calls[0][0]).toEqual('/visit/1');
  });


});

describe("Component functionality patient view", () => {

  it('displays details', () => {
    const wrapper = mount(<VisitItem visit = {visitPatient} role = {patientRole} upcomingVisit = {true}/>);
    var value = wrapper.find("a").at(0).text();
    expect(value).toEqual(visitDoctor.reservationStartTime.split('T')[0]);
    value = wrapper.find("a").at(1).text();
    expect(value).toEqual("06:00 - 06:30");
    value = wrapper.find("a").at(2).text();
    expect(value).toEqual(visitPatient.localName);
    value = wrapper.find("a").at(4).text();
    expect(value).toEqual("Pokój: " + visitPatient.roomNumber);
    value = wrapper.find("a").at(5).text();
    expect(value).toEqual(visitPatient.doctorName.concat(' ').concat(visitPatient.doctorLastname));
  });

  it('should call dialogCallback when clicked on Odwołaj button', () => {
    const mockedCallBack = jest.fn((visit,  event)  => {
      return visit
    });
    const {debug, getByText} = render(<VisitItem visit = {visitPatient} role = {patientRole} upcomingVisit = {true}
      dialogCallback = {mockedCallBack}/>);
    var btnCancel = getByText('Odwołaj');
    fireEvent.click(btnCancel);
    expect(mockedCallBack).toHaveBeenCalledTimes(1);
    expect(mockedCallBack.mock.calls[0][0]).toEqual(visitPatient);
  });

  it('should call history.push when clicked on Zobacz button', () => {
    const historyMock = { push: jest.fn((path) => {
      return path
    }) };
    const {debug, getByText} = render(<VisitItem visit = {visitPatient} role = {patientRole} upcomingVisit = {false}
      history = {historyMock}/>);
    var btnCancel = getByText('Zobacz');
    fireEvent.click(btnCancel);
    expect(historyMock.push).toHaveBeenCalledTimes(1);
    expect(historyMock.push.mock.calls[0][0]).toEqual('/visit/1');
  });

  it('should hide Zobacz button if the visit is upcoming and role is not doctor', () => {
    const {debug, queryByText} = render(<VisitItem visit = {visitPatient} role = {patientRole} upcomingVisit = {true}/>);
    var btnCancel = queryByText('Zobacz');
    expect(btnCancel).toBeNull();
  });


});
