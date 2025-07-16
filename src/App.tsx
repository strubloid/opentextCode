import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./App.css";

type Employee = {
  id: number,
  employee_name: string,
  age: number,
  salary: number,
  job_title: string
}

function App() {

  const ApiURL = "https://employeesapp.azurewebsites.net/api/GetEmployees";
  let employeesData: Employee[] = []; // here will contain all the data from the axios get request
  let [EmployeeWithequiredAge, setEmployeeWithequiredAge] = useState<Employee[]>([]); // here will be the data filtered by the age > 30

  // This function is responsible for the loading of the data that came from the employeesApp
  const LoadServerData = async () => {
    
    // loading all usersData
    let responseData = await axios({
      method: "get",
      url: ApiURL,
      responseType: "json",
    });

    // Basic making sure that the response Data JsonObject contain data to iterate
    if (responseData != null && responseData.data != null && responseData.data.employees != null){
        
      // getting the correct place that contain data from the employees
      employeesData = responseData.data.employees;
      
      // This should be only loaded if age is bigger than 30
      setEmployeeWithequiredAge(employeesData.filter( person => person.age > 30))
    }
    
  };

  // Starting the application with the load of data
  useEffect(() => {
    
    LoadServerData(); 
    console.log("loadedd")

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
