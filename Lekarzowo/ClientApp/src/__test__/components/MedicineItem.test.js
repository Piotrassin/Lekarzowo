import MedicineItem from '../../components/MedicineItem.js';
import {shallow, mount, debug} from 'enzyme';
import {render, fireEvent} from '@testing-library/react';
import React from 'react';

const medicine = {
  medicine: {
    name: "Apap 10mg"
  },
  description: "Stosować 1 dziennie - wieczorem",
  startDate: new Date().toISOString(),
  finishDate: new Date().toISOString()
};

it('renders', () => {
  shallow(<MedicineItem medicine = {medicine} />);
});

it('accepts props', () => {
  const wrapper = mount(<MedicineItem medicine = {medicine}  />);
  expect(wrapper.props().medicine.medicineName).toEqual(medicine.medicineName);
  expect(wrapper.props().medicine.medicineDosage).toEqual(medicine.medicineDosage);
});

describe("Component functionality", () => {

  it('displays medicine details', () => {
    const wrapper = mount(<MedicineItem medicine = {medicine}/>);
    var value = wrapper.find("a").at(0).text();
    expect(value).toEqual("Apap 10mg");
    value = wrapper.find("a").at(1).text();
    expect(value).toEqual("Stosować 1 dziennie - wieczorem");
  });
});
