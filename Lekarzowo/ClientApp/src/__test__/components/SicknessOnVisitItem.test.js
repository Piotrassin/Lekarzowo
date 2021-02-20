import SicknessOnVisitItem from '../../components/SicknessOnVisitItem.js';
import {shallow, mount, debug} from 'enzyme';
import {render, fireEvent, wait} from '@testing-library/react';
import React from 'react';

const sickness = {
  sicknessName: 'Ból głowy',
  sicknessDescription: 'Zdiagnozowano ból w tylnej części głowy',
  id: 1
};

it('renders', () => {
  shallow(<SicknessOnVisitItem sicknessName = {sickness.sicknessName} sicknessDescription = {sickness.sicknessDescription}
    id = {sickness.id}/>);
});

it('accepts props', () => {
  const wrapper = mount(<SicknessOnVisitItem sicknessName = {sickness.sicknessName} sicknessDescription = {sickness.sicknessDescription}
    id = {sickness.id}/>);
  expect(wrapper.props().sicknessName).toEqual(sickness.sicknessName);
  expect(wrapper.props().sicknessDescription).toEqual(sickness.sicknessDescription);
  expect(wrapper.props().id).toEqual(sickness.id);
});

describe("Component functionality", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch ok when clicked on remove sign', async () => {
    const spyGlobalFetch = jest.spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve({})
    }));
    const mockedCallBack = jest.fn((message, css, prop1, prop2, prop3)  => {
      return message
    });
    window.confirm = jest.fn(() => true);
    const {debug, getByRole} = render(<SicknessOnVisitItem sicknessName = {sickness.sicknessName} sicknessDescription = {sickness.sicknessDescription}
      id = {sickness.id} isOpen = {true} snackbarCallback = {mockedCallBack}/>);
    var imgBtn = getByRole('img', {src: /RemoveSign.svg/i});
    fireEvent.click(imgBtn);
    //debug();
    expect(window.confirm).toHaveBeenCalled();
    await wait(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(mockedCallBack).toHaveBeenCalledWith("Usunięto", "green-snackbar", "visitSickness", {"id": 1, "sicknessDescription": "Zdiagnozowano ból w tylnej części głowy", "sicknessName": "Ból głowy"}, "illnessHistoryId");

  });

  it('should fetch error when clicked on remove sign', async () => {
    const spyGlobalFetch = jest.spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve({
      status: 500,
      ok: true
    }));
    const mockedCallBack = jest.fn((message, css, prop1, prop2, prop3)  => {
      return message
    });
    const {debug, getByRole} = render(<SicknessOnVisitItem sicknessName = {sickness.sicknessName} sicknessDescription = {sickness.sicknessDescription}
      id = {sickness.id} isOpen = {true} snackbarCallback = {mockedCallBack}/>);
    var imgBtn = getByRole('img', {src: /RemoveSign.svg/i});
    fireEvent.click(imgBtn);
    await wait(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(mockedCallBack).toHaveBeenCalledWith("Nie udało się usuniąć", "red-snackbar");

  });

});
