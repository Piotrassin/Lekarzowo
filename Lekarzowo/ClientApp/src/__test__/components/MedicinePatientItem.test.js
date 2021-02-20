import MedicinePatientItem from '../../components/MedicinePatientItem.js';
import {shallow, mount, debug} from 'enzyme';
import {render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';

const medicine = {
  medicineName: "Apap 10mg",
  dose: "1 dziennie",
  startdate: new Date("2020-10-20").toISOString(),
  finishdate: new Date("2020-10-21").toISOString(),
  illnesshistoryId: 1,
  medicineId: 1
};



it('renders', () => {
  shallow(<MedicinePatientItem medicine  = {medicine} medicineName = {medicine.medicineName}
    dose = {medicine.dose}/>);
});

it('accepts props', () => {
  const wrapper = mount(<MedicinePatientItem medicine  = {medicine} medicineName = {medicine.medicineName}
    dose = {medicine.dose}/>);
  expect(wrapper.props().medicine.medicineName).toEqual(medicine.medicineName);
  expect(wrapper.props().medicine.dose).toEqual(medicine.dose);
  expect(wrapper.props().medicine.startDate).toEqual(medicine.startDate);
  expect(wrapper.props().medicine.finishdate).toEqual(medicine.finishdate);
  expect(wrapper.props().medicineName).toEqual(medicine.medicineName);
  expect(wrapper.props().dose).toEqual(medicine.dose);
});

describe("Component functionality", () => {

  const { reload } = window.location;

  beforeAll(() => {
    Object.defineProperty(window.location, 'reload', {
      configurable: true,
    });
    window.location.reload = jest.fn();
  });

  afterAll(() => {
    window.location.reload = reload;
  });

  afterEach(() => {
    jest.clearAllMocks();

  });

  it('displays details', () => {
    const {debug} = render(<MedicinePatientItem medicine  = {medicine} medicineName = {medicine.medicineName}
      dose = {medicine.dose}/>);
      //debug();
    const wrapper = mount(<MedicinePatientItem medicine  = {medicine} medicineName = {medicine.medicineName}
      dose = {medicine.dose}/>);
    var value = wrapper.find("b").at(0).text();
    expect(value).toEqual("Apap 10mg");
    value = wrapper.find("a").at(0).text();
    expect(value).toEqual("1 dziennie");
    value = wrapper.find("b").at(1).text();
    expect(value).toEqual("2020-10-20");
    value = wrapper.find("b").at(2).text();
    expect(value).toEqual("2020-10-21");
  });

  it('fires Button with ok fetch',  async () => {
    const spied = jest.spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve({})
    }));
    const { getByText } = render(<MedicinePatientItem medicine  = {medicine} medicineName = {medicine.medicineName}
      dose = {medicine.dose}/>);
    var btn = getByText("Pacjent nie przyjmuje");
    fireEvent.click(btn);
    await wait(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('fires Button with error fetch',  async () => {
    const spied = jest.spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve({
      status: 500,
      ok: false
    }));
    var snackbarCallback = ((message, style) => {

    });
    const { getByText } = render(<MedicinePatientItem medicine  = {medicine} medicineName = {medicine.medicineName}
      dose = {medicine.dose} snackbarCallback = {snackbarCallback}/>);
    var btn = getByText("Pacjent nie przyjmuje");
    fireEvent.click(btn);
    await wait(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(window.location.reload).toHaveBeenCalledTimes(0);
  });


});
