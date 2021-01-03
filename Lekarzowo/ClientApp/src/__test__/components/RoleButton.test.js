import RoleButton from '../../components/RoleButton.js';
import {shallow, mount, debug} from 'enzyme';
import {render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';

it('renders', () => {
  shallow(<RoleButton />);
});

describe("Component functionality all roles", () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should show all mapped user roles', () => {
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
    const {getAllByRole, getByRole} = render(<RoleButton />);
    var btn = getByRole('button');
    fireEvent.click(btn);
    var btnOptions = getAllByRole('menuitem');
    var btnOptions = btnOptions.map((el, id) => {
      return el.innerHTML.split('<span')[0]
    });
    expect(btnOptions).toContain("Pacjent");
    expect(btnOptions).toContain("Doktor");
    expect(btnOptions).toContain("Admin");
  });

  it('should fire setItem when clicking a patient role and redirect to /', async () => {
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
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
    const spySetItem = jest.spyOn(Storage.prototype, 'setItem')
    .mockImplementation((key) => {

    });
    const spyGlobalFetch = jest.spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve({
        "token": "ecdsdcsdc"
      })
    }));
    const historyMock = { push: jest.fn((path) => {
      return path
    }) };
    const {getAllByRole, getByRole} = render(<RoleButton history = {historyMock} />);
    var btn = getByRole('button');
    fireEvent.click(btn);
    var btnOptionPatient = getByRole('menuitem', {name: 'Pacjent'});
    fireEvent.click(btnOptionPatient);
    spyGetItem.mockReset();
    spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":141,
      "firstName":"Andrzej",
      "lastName":"Andrzejewski",
      "email":"a@a.a",
      "roles":["patient","doctor","admin"],
      "token":"ecdsdcsdc"
      ,"currentRole":"patient"
    })
    });
    await wait(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch.mock.calls[0][0]).toBe("https://localhost:5001/api/people/changeactiverole?roleToActivateName=patient");
    expect(spySetItem).toHaveBeenCalledTimes(1);
    expect(historyMock.push).toHaveBeenCalledTimes(1);
    expect(historyMock.push.mock.calls[0][0]).toEqual('/');
  });

  it('should fire setItem when clicking a doctor role and redirect to /dashboardDoctor', async () => {
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
    const spySetItem = jest.spyOn(Storage.prototype, 'setItem')
    .mockImplementation((key) => {

    });
    const spyGlobalFetch = jest.spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve({
        "token": "ecdsdcsdc"
      })
    }));
    const historyMock = { push: jest.fn((path) => {
      return path
    }) };
    const {getAllByRole, getByRole} = render(<RoleButton history = {historyMock} />);
    var btn = getByRole('button');
    fireEvent.click(btn);
    var btnOptionPatient = getByRole('menuitem', {name: 'Doktor'});
    fireEvent.click(btnOptionPatient);
    spyGetItem.mockReset();
    spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":141,
      "firstName":"Andrzej",
      "lastName":"Andrzejewski",
      "email":"a@a.a",
      "roles":["patient","doctor","admin"],
      "token":"ecdsdcsdc"
      ,"currentRole":"doctor"
    })
    });
    await wait(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch.mock.calls[0][0]).toBe("https://localhost:5001/api/people/changeactiverole?roleToActivateName=doctor");
    expect(spySetItem).toHaveBeenCalledTimes(1);
    expect(historyMock.push).toHaveBeenCalledTimes(1);
    expect(historyMock.push.mock.calls[0][0]).toEqual('/dashboardDoctor');
  });

  it('should fire setItem when clicking an admin role and redirect to /adminPanel', async () => {
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
    const spySetItem = jest.spyOn(Storage.prototype, 'setItem')
    .mockImplementation((key) => {

    });
    const spyGlobalFetch = jest.spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve({
        "token": "ecdsdcsdc"
      })
    }));
    const historyMock = { push: jest.fn((path) => {
      return path
    }) };
    const {getAllByRole, getByRole} = render(<RoleButton history = {historyMock} />);
    var btn = getByRole('button');
    fireEvent.click(btn);
    var btnOptionPatient = getByRole('menuitem', {name: 'Admin'});
    fireEvent.click(btnOptionPatient);
    spyGetItem.mockReset();
    spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":141,
      "firstName":"Andrzej",
      "lastName":"Andrzejewski",
      "email":"a@a.a",
      "roles":["patient","doctor","admin"],
      "token":"ecdsdcsdc"
      ,"currentRole":"admin"
    })
    });
    await wait(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch.mock.calls[0][0]).toBe("https://localhost:5001/api/people/changeactiverole?roleToActivateName=admin");
    expect(spySetItem).toHaveBeenCalledTimes(1);
    expect(historyMock.push).toHaveBeenCalledTimes(1);
    expect(historyMock.push.mock.calls[0][0]).toEqual('/adminPanel');
  });


});
