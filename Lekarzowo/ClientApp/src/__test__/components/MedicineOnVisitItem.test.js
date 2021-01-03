import MedicineOnVisitItem from '../../components/MedicineOnVisitItem.js';
import {shallow, mount, debug} from 'enzyme';
import {render, fireEvent} from '@testing-library/react';
import React from 'react';

const medicine = {
  illnessHistoryId: 1,
  medicineId: 1,
  startDate: new Date(),
  medicineName: "Apap 10mg",
  medicineDescription: "Zastosowac raz dziennie"
};

it('renders', () => {
  shallow(<MedicineOnVisitItem illnessHistoryId = {medicine.illnessHistoryId} medicineId = {medicine.medicineId}
    startDate = {medicine.startDate} medicineName = {medicine.medicineName}
    medicineDescription = {medicine.medicineDescription} />);
});

it('accepts props', () => {
  const wrapper = mount(<MedicineOnVisitItem illnessHistoryId = {medicine.illnessHistoryId} medicineId = {medicine.medicineId}
    startDate = {medicine.startDate} medicineName = {medicine.medicineName}
    medicineDescription = {medicine.medicineDescription} />);
  expect(wrapper.props().illnessHistoryId).toEqual(medicine.illnessHistoryId);
  expect(wrapper.props().medicineId).toEqual(medicine.medicineId);
  expect(wrapper.props().startDate).toEqual(medicine.startDate);
  expect(wrapper.props().medicineName).toEqual(medicine.medicineName);
  expect(wrapper.props().medicineDosage).toEqual(medicine.medicineDosage);
});

describe("Component functionality", () => {


});
