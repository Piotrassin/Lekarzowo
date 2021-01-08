import ReservationItem from '../../components/ReservationItem.js';
import {shallow, mount, debug} from 'enzyme';
import {render, fireEvent} from '@testing-library/react';
import React from 'react';

const reservation = {
  start: new Date("2020-10-20").toISOString(),
  end: new Date("2020-10-21").toISOString(),
  localName: "Szpital Kliniczny",
  doctorName: "Andrzej",
  doctorLastname: "Andrzejewski"
};

const clickCallback = (reservation) => {
  return reservation;
}


it('renders', () => {
  shallow(<ReservationItem reservation = {reservation} />);
});

it('accepts props', () => {
  const wrapper = mount(<ReservationItem reservation = {reservation} onClickHandler = {clickCallback}/>);
  expect(wrapper.props().reservation.start).toEqual(reservation.start);
  expect(wrapper.props().reservation.end).toEqual(reservation.end);
  expect(wrapper.props().reservation.localName).toEqual(reservation.localName);
  expect(wrapper.props().reservation.doctorName).toEqual(reservation.doctorName);
  expect(wrapper.props().reservation.doctorLastname).toEqual(reservation.doctorLastname);
});

describe("Component functionality", () => {

  it('displays details', () => {
    const wrapper = mount(<ReservationItem reservation = {reservation} onClickHandler = {clickCallback}/>);
    var value = wrapper.find("b").at(0).text();
    expect(value).toEqual("2020-10-20");
    var value = wrapper.find("a").at(1).text();
    expect(value).toEqual("00:00 - 00:00");
    var value = wrapper.find("a").at(3).text();
    expect(value).toEqual("Szpital Kliniczny");
    var value = wrapper.find("a").at(5).text();
    expect(value).toEqual("Andrzej Andrzejewski");
  });

  it('fires Button',  () => {
    const mockedCallBack = jest.fn((reservation)  => {
      return reservation
    });
    const { getByRole } = render(<ReservationItem reservation = {reservation} onClickHandler = {mockedCallBack}/>);
    var btn = getByRole('button', {name: ""});
    fireEvent.click(btn);
    expect(mockedCallBack).toHaveBeenCalled();
    expect(mockedCallBack.mock.results[0].value).toEqual(reservation);
  });




});
