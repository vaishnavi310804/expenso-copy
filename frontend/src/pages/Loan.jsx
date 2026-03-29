import React, { useContext } from "react";
import { useData } from "../context/DataContext";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../context/UserContext";
import NavbarPages from "../components/NavbarPages";

const LoanSuggestion = (balance) => {
  if (balance >= 1000) return null;

  return [
    {
      title: "Personal Loan",
      interest: "5%",
      link: "https://www.bank.com/loan",
    },
    {
      title: "Credit Card",
      interest: "15%",
      link: "https://www.bank.com/credit-card",
    },
    {
      title: "Personal Loan",
      interest: "10%",
      link: "https://www.bank.com/personal-loan",
    },
    {
      title: "Bajaj Finance Loan",
      interest: "8%",
      link: "https://www.bank.com/home-loan",
    },
  ];
};

const Loan = () => {
  const { userData, currentUserEmail, setCurrentUserEmail } = useData();
  const { theme, menu, setMenu, setTheme } = useContext(UserContext);
  const user = userData[currentUserEmail];

  if (!user) {
    return (
      <p className="text-2xl p-6 text-center text-black">
        User data not found.
      </p>
    );
  }

  const suggestion = LoanSuggestion(user.balance || 0);
  if (!suggestion) return null;

  const { name, profilePic } = user;

  return (
    <div
      className={`flex flex-col h-screen ${
        theme ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <NavbarPages/>
      <div
        className={`flex flex-1 overflow-hidden ${
          theme ? "bg-gray-700" : "bg-gray-50"
        }`}
      >
        <div className="hidden md:block fixed top-0 left-0 h-screen w-56 lg:w-64 shadow-md bg-white z-40">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-y-auto md:ml-56 lg:ml-64 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestion.map((loan, index) => (
              <div
                key={index}
                className={`${
                  theme
                    ? "bg-gray-300 border-gray-500"
                    : "bg-white border-gray-100"
                } shadow-md rounded-xl p-6 hover:shadow-xl transition-shadow duration-300 border`}
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  {loan.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  Interest Rate:{" "}
                  <span className="font-semibold text-purple-600">
                    {loan.interest}
                  </span>
                </p>
                <a
                  href={loan.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loan;
