import Profile from '../Profile.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';

it('renders', () => {
  const spyGlobalFetch = jest.spyOn(window, 'fetch')
  .mockImplementation((url, options) => {
    return Promise.resolve(MockBackend.mockFetch(url, options));
  });
  var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
  .mockImplementation((key) => {return JSON.stringify(
    {"id":141,
    "firstName":"Andrzej",
    "lastName":"Andrzejewski",
    "email":"a@a.a",
    "roles":["patient","doctor","admin"],
    "token":"zsdscdsw"
    ,"currentRole":"patient"
  })
  });
  shallow(<Profile  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should fetch on display', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":141,
      "firstName":"Andrzej",
      "lastName":"Andrzejewski",
      "email":"a@a.a",
      "roles":["patient","doctor","admin"],
      "token":"zsdscdsw"
      ,"currentRole":"patient"
    })
    });
    const {debug, getByRole, getByLabelText, getByText} = render(<Profile />);
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    expect(spyGlobalFetch).toHaveBeenCalled();
  });


});
