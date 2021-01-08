import SicknessPatientItem from '../../components/SicknessPatientItem.js';
import {shallow, mount, debug} from 'enzyme';
import {render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';

const sickness = {
  illnessName: "Ból głowy",
  description: "Zdiagnozowano ból w tylnej części głowy"
};



it('renders', () => {
  shallow(<SicknessPatientItem sickness = {sickness} />);
});

it('accepts props', () => {
  const wrapper = mount(<SicknessPatientItem sickness = {sickness} />);
  expect(wrapper.props().sickness.illnessName).toEqual(sickness.illnessName);
  expect(wrapper.props().sickness.description).toEqual(sickness.description);
});

describe("Component functionality", () => {

  it('displays details', () => {
    const wrapper = mount(<SicknessPatientItem sickness = {sickness} />);
    var value = wrapper.find("b").at(0).text();
    expect(value).toEqual("Ból głowy");
    value = wrapper.find("a").at(0).text();
    expect(value).toEqual("Zdiagnozowano ból w tylnej części głowy");
  });

});
