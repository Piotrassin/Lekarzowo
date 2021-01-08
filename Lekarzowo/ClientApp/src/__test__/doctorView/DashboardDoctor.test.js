import DashboardDoctor from '../../doctorView/DashboardDoctor.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../../__mocks__/MockBackend.js.js';



it('renders', () => {
  const spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
  .mockImplementation((key) => {return JSON.stringify(
    {"id":141,
    "firstName":"Andrzej",
    "lastName":"Andrzejewski",
    "email":"a@a.a",
    "roles":["patient","doctor","admin"],
    "token":"zsdscdsw"
    ,"currentRole":"doctor"
  })
  });
  render(<DashboardDoctor  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should call fetch when render', () => {
    const spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":141,
      "firstName":"Andrzej",
      "lastName":"Andrzejewski",
      "email":"a@a.a",
      "roles":["patient","doctor","admin"],
      "token":"zsdscdsw"
      ,"currentRole":"doctor"
    })
    });
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    render(<DashboardDoctor  />);
    expect(spyGlobalFetch).toHaveBeenCalledTimes(2);
    expect(spyGlobalFetch.mock.calls[0][0]).toEqual('https://localhost:5001/api/workinghours/DoctorsUpcomingSchedule?doctorId=141&days=7');
    expect(spyGlobalFetch.mock.calls[1][0]).toEqual('https://localhost:5001/api/Reservations/UpcomingByDoctorId?doctorId=141&localId=1&start=2021-01-04&end=2021-01-04&limit=&skip=');
  });

  it('should display data', async () => {
    const spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":141,
      "firstName":"Andrzej",
      "lastName":"Andrzejewski",
      "email":"a@a.a",
      "roles":["patient","doctor","admin"],
      "token":"zsdscdsw"
      ,"currentRole":"doctor"
    })
    });
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByText} = render(<DashboardDoctor  />);
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalledTimes(2));
    var value = getByText('2020-10-20');
    var value = getByText('08:30 - 09:00');
    var value = getByText('Bartosz Bartoszewski');
  });

  it('should rediect properly when clicked on Przejdź button', async () => {
    const spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":141,
      "firstName":"Andrzej",
      "lastName":"Andrzejewski",
      "email":"a@a.a",
      "roles":["patient","doctor","admin"],
      "token":"zsdscdsw"
      ,"currentRole":"doctor"
    })
    });
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const historyMock = { push: jest.fn((path) => {
      return path
    }) };
    const {debug, getByText} = render(<DashboardDoctor history = {historyMock}  />);
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalledTimes(2));
    var btn = getByText('Przejdź');
    fireEvent.click(btn);
    expect(historyMock.push).toHaveBeenCalledTimes(1);
    expect(historyMock.push.mock.calls[0][0]).toEqual('/visits');
  });

  it('should rediect properly when clicked on Zobacz wizyty button', async () => {
    const spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":141,
      "firstName":"Andrzej",
      "lastName":"Andrzejewski",
      "email":"a@a.a",
      "roles":["patient","doctor","admin"],
      "token":"zsdscdsw"
      ,"currentRole":"doctor"
    })
    });
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const historyMock = { push: jest.fn((path) => {
      return path
    }) };
    const {debug, getByText} = render(<DashboardDoctor history = {historyMock}  />);
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalledTimes(2));
    var btn = getByText('Twoje').parentNode.parentNode;
    //debug();
    fireEvent.click(btn);
    expect(historyMock.push).toHaveBeenCalledTimes(1);
    expect(historyMock.push.mock.calls[0][0]).toEqual('/visits');
  });

  it('should rediect properly when clicked on Zobacz wizyty button', async () => {
    const spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":141,
      "firstName":"Andrzej",
      "lastName":"Andrzejewski",
      "email":"a@a.a",
      "roles":["patient","doctor","admin"],
      "token":"zsdscdsw"
      ,"currentRole":"doctor"
    })
    });
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const historyMock = { push: jest.fn((path) => {
      return path
    }) };
    const {debug, getByText} = render(<DashboardDoctor history = {historyMock}  />);
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalledTimes(2));
    var btn = getByText('Wyszukaj').parentNode.parentNode;
    debug();
    fireEvent.click(btn);
    expect(historyMock.push).toHaveBeenCalledTimes(1);
    expect(historyMock.push.mock.calls[0][0]).toEqual('/findDoctor');
  });

})

describe('site functionality with fetch status 500', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should not break when fetch returns error', async () => {
    const spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":141,
      "firstName":"Andrzej",
      "lastName":"Andrzejewski",
      "email":"a@a.a",
      "roles":["patient","doctor","admin"],
      "token":"zsdscdsw"
      ,"currentRole":"doctor"
    })
    });
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
    });
    const wrapper = shallow(<DashboardDoctor  />);
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalledTimes(2));


  });

});
