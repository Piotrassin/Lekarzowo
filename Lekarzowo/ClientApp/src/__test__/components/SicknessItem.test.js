import SicknessItem from '../../components/SicknessItem.js';
import {shallow, mount, debug} from 'enzyme';
import {render, fireEvent} from '@testing-library/react';
import React from 'react';

const sickness = {
  illness: {
    name: "Ból głowy"
  },
  description: "Zdiagnozowano z tyłu głowy",
  visitId: 1
};

it('renders', () => {
  shallow(<SicknessItem sickness = {sickness} />);
});

it('accepts props', () => {
  const wrapper = mount(<SicknessItem sickness = {sickness} />);
  expect(wrapper.props().sickness.illness.name).toEqual(sickness.illness.name);
  expect(wrapper.props().sickness.description).toEqual(sickness.description);
  expect(wrapper.props().sickness.visitId).toEqual(sickness.visitId);
});

describe("Component functionality", () => {

  it('displays sickness details', () => {
    const wrapper = mount(<SicknessItem sickness = {sickness} />);
    var value = wrapper.find("a").at(0).text();
    expect(value).toEqual("Ból głowy");
    value = wrapper.find("a").at(1).text();
    expect(value).toEqual("Zdiagnozowano z tyłu głowy");
  });

  it('fire button and redirect', () => {
    const historyMock = { push: jest.fn((path) => {
      return path
    }) };
    const {getByText} = render(<SicknessItem sickness = {sickness} history = {historyMock}/>);
    var btn = getByText('Zobacz Wizytę');
    fireEvent.click(btn);
    expect(historyMock.push).toHaveBeenCalled();
    expect(historyMock.push.mock.calls[0][0]).toEqual('/visit/1');
  });
});
