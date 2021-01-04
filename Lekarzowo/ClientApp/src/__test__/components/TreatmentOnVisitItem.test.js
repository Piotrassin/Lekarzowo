import TreatmentOnVisitItem from '../../components/TreatmentOnVisitItem.js';
import {shallow, mount, debug} from 'enzyme';
import {render, fireEvent, wait} from '@testing-library/react';
import React from 'react';

const treatment = {
  treatmentName: 'Rentgen',
  treatmentDescription: 'Przeprowadzono rentgen kręgosłupa',
  id: 1
};

it('renders', () => {
  shallow(<TreatmentOnVisitItem treatmentName = {treatment.treatmentName} treatmentDescription = {treatment.treatmentDescription}
    id = {treatment.id}/>);
});

it('accepts props', () => {
  const wrapper = mount(<TreatmentOnVisitItem treatmentName = {treatment.treatmentName} treatmentDescription = {treatment.treatmentDescription}
    id = {treatment.id}/>);
  expect(wrapper.props().treatmentName).toEqual(treatment.treatmentName);
  expect(wrapper.props().treatmentDescription).toEqual(treatment.treatmentDescription);
  expect(wrapper.props().id).toEqual(treatment.id);
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
    const {debug, getByRole} = render(<TreatmentOnVisitItem treatmentName = {treatment.treatmentName} treatmentDescription = {treatment.treatmentDescription}
      id = {treatment.id} isOpen = {true} snackbarCallback = {mockedCallBack}/>);
    var imgBtn = getByRole('img', {src: /RemoveSign.svg/i});
    fireEvent.click(imgBtn);
    await wait(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(mockedCallBack).toHaveBeenCalledWith("Usunięto", "green-snackbar", "visitTreatment", {"id": 1, "treatmentName": "Rentgen", "treatmentDescription": "Przeprowadzono rentgen kręgosłupa"}, "id");

  });

  it('should fetch error when clicked on remove sign', async () => {
    const spyGlobalFetch = jest.spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve({
      status: 500,
      ok: false
    }));
    const mockedCallBack = jest.fn((message, css, prop1, prop2, prop3)  => {
      return message
    });
    const {debug, getByRole} = render(<TreatmentOnVisitItem treatmentName = {treatment.treatmentName} treatmentDescription = {treatment.treatmentDescription}
      id = {treatment.id} isOpen = {true} snackbarCallback = {mockedCallBack}/>);
    var imgBtn = getByRole('img', {src: /RemoveSign.svg/i});
    fireEvent.click(imgBtn);
    await wait(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(mockedCallBack).toHaveBeenCalledWith("Nie udało się usuniąć", "red-snackbar");

  });

});
