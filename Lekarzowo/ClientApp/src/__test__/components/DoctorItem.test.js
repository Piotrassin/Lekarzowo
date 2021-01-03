import DoctorItem from '../../components/DoctorItem.js';
import {shallow, mount, debug} from 'enzyme';
import {render, fireEvent} from '@testing-library/react';
import React from 'react';

const user = {
  name: "Andrzej Andrzejewski",
  id: 1
};

const clickCallback = (id) => {
  return id
}


it('renders', () => {
  shallow(<DoctorItem />);
});

it('accepts props', () => {
  const wrapper = mount(<DoctorItem name = {user.name} id = {user.id} clickCallback = {clickCallback}/>);
  expect(wrapper.props().name).toEqual(user.name);
  expect(wrapper.props().id).toEqual(user.id);
});

describe("Component functionality", () => {

  it('displays name', () => {
    const wrapper = mount(<DoctorItem name = {user.name} id = {user.id} />);
    const value = wrapper.find("a").text();
    expect(value).toEqual("Andrzej Andrzejewski");
  });

  it('firesButton',  () => {
    const mockedCallBack = jest.fn((id)  => {
      return id
    });
    const { getByRole } = render(<DoctorItem name = {user.name} id = {user.id} clickCallback = {mockedCallBack}/>);
    var btn = getByRole('button', {name: /Wybierz/i});
    fireEvent.click(btn);
    expect(mockedCallBack.mock.results[0].value).toEqual(1);
  });


});
