import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./App.css";
import { Employee } from "./Employee";

function App() {

  const ApiURL = "https://employeesapp.azurewebsites.net/api/GetEmployees";

  // here will contain all the data from the axios get request
  let employeesData: Employee[] = []; 

  // here will be the data filtered by the age > 30
  let [EmployeeWithequiredAge, setEmployeeWithequiredAge] = useState<Employee[]>([]); 

  /**
   * LoadServerData is an asynchronous function that fetches employee data from a remote API.
   * It uses axios to make a GET request to the specified API URL.
   * If the response contains valid employee data, it filters the employees to include only those older
   * than 30 years and updates the state with this filtered list.
   */
  const LoadServerData = async () => {
    
    // loading all usersData
    let responseData = await axios({
      method: "get",
      url: ApiURL,
      responseType: "json",
    });

    // This will check if exist responseData with basic validation, and will be doing the filtering by the age > 30
    if (responseData != null && responseData.data != null && responseData.data.employees != null){
      employeesData = responseData.data.employees;
      setEmployeeWithequiredAge(employeesData.filter( person => person.age > 30))
    }
    
  };

  // Starting the application with the load of data
  useEffect(() => {
    LoadServerData(); 
  }, []);

  return (
    <>
    <div id="content">
      <h2>Employees Over 30</h2>
      {
        EmployeeWithequiredAge.length > 0 ? 
        (
          <table>
            <thead>
              <th>Name</th>
              <th>Salary</th>
              <th>Age</th>
            </thead>
            <tbody>
                { EmployeeWithequiredAge.map((emp : Employee) => (
                <tr>
                  <td>{emp.employee_name}</td>
                  <td>{emp.salary}</td>
                  <td>{emp.age}</td>
                </tr>
                ))}
            </tbody>
      </table>
        ) : (   
          <p>Things are loading...</p>
        )
      }
      </div>
    </>
  );
}

export default App;
