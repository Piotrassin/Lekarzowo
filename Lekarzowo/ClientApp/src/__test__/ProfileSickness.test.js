import ProfileSickness from '../ProfileSickness.js';
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
  shallow(<ProfileSickness  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display list of sicknesses', async () => {
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
    const {debug, getByRole, getByLabelText, getByText} = render(<ProfileSickness />);
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    var info = getByText('Ból głowy');
    info = getByText('Zdiagnozowano z tyłu głowy');
    var goToBtn = getByText('Zobacz Wizytę');

  });


});

describe('site functionality with fetch status 500', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display error message when unable to fetch sicknesses', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
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
    const {debug, getByRole, getByLabelText, getByText} = render(<ProfileSickness />);
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });

});
