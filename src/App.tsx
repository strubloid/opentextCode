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

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);

  // Pagination variables
  const totalPages = Math.ceil(EmployeeWithequiredAge.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = EmployeeWithequiredAge.slice(startIndex, endIndex);

  // Pagination for the next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Pagination for the previous page
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // this is basic the set of the current page number
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  /**
   * 
   * @returns Function to build pagination info text, so every time the user will change the page, it will be updated.
   */
  const getPaginationInfo = (): string => {
    const start = startIndex + 1;
    const end = Math.min(endIndex, EmployeeWithequiredAge.length);
    const total = EmployeeWithequiredAge.length;
    return `Showing ${start} to ${end} of ${total} employees`;
  };

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
      setCurrentPage(1); // Reset to first page when new data is loaded
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
          <>
            <table role="table" aria-label="Employees over 30 years old">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Salary</th>
                  <th scope="col">Age</th>
                </tr>
              </thead>
              <tbody>
                  { currentEmployees.map((emp : Employee) => (
                  <tr key={emp.id}>
                    <td>{emp.employee_name}</td>
                    <td>{"$" + emp.salary.toLocaleString()}</td>
                    <td>{emp.age}</td>
                  </tr>
                  ))}
              </tbody>
            </table>
            
            <nav className="pagination-controls" aria-label="Pagination Navigation" role="navigation">

              <div className="pagination-info" aria-live="polite" aria-atomic="true">
                {getPaginationInfo()}
              </div>
              
              <div className="pagination-buttons" role="group" aria-label="Pagination buttons">
                <button  
                  onClick={goToPrevPage}  
                  disabled={currentPage === 1} 
                  className="pagination-btn"
                  aria-label="Go to previous page"
                  title="Go to previous page"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button 
                    key={page} 
                    onClick={() => goToPage(page)} 
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                    title={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                ))}
                
                <button  
                  onClick={goToNextPage}  
                  disabled={currentPage === totalPages} 
                  className="pagination-btn"
                  aria-label="Go to next page"
                  title="Go to next page"
                >
                  Next
                </button>

              </div>
            </nav>
          </>
        ) : (   
          <div role="status" aria-live="polite" aria-label="Loading employees data">
            <p>Table are loading...</p>
          </div>
        )
      }
      </div>
    </>
  );
}

export default App;
