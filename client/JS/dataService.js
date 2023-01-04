export class DataService {
  async createClient(name, surname, lastname, contacts) {
    const respone = await fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        surname: surname,
        lastName: lastname,
        contacts,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await respone.json();
    return {
      data,
      status: respone.status,
    };
  }

  async changeClient(id, name, surname, lastname, contacts) {
    const respone = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: name,
        surname: surname,
        lastName: lastname,
        contacts,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await respone.json();
    return {
      data,
      status: respone.status,
    };
  }

  async deleteClient(id) {
    const data = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'DELETE',
    });
    return { status: data.status };
  }

  async fetchClients() {
    const respone = await fetch('http://localhost:3000/api/clients');
    const data = await respone.json();
    console.log(data);
    return {
      data,
      status: respone.status,
    };
  }

  async searchClientsId(id) {
    const respone = await fetch(`http://localhost:3000/api/clients/${id}`);
    const data = await respone.json();
    return {
      data,
      status: respone.status,
    };
  }

  async searchAutoFill(sign) {
     const response = await fetch(
       `http://localhost:3000/api/clients?search=${sign}`
     );
    const data = await response.json();
    return data
  }
}
