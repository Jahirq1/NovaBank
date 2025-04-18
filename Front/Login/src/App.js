import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="container-fluid p-0 m-0" style={{ overflow: "hidden" }}>
      <div className="row no-gutters vh-100" 
      style={{ overflow: "hidden", backgroundColor: "#D4CECB" }}>
        {/* Kolona e Formularit të Login-it */}
        <div className="col-md-6 d-flex justify-content-center align-items-center p-4" style={{ marginBottom: "15%" }}>
          <div 
            className="card p-4" 
            style={{
              maxWidth: "100%", 
              width: "60%",
              background: "transparent",
              border: "0.2px solid yellow",
              borderRadius:"20px"
            }}
          >
            <h3 className="text-center mb-4">Login</h3>
            <p className="text-center mb-4">Trust us with your journey, let's do it together.</p>
            <form className="d-flex flex-column justify-content-between" style={{ height: "100%", width: "100%", alignItems: "center"}}>
              <div className="form-group mb-3">
                <label htmlFor="username" style={{ color: "rgb(244, 168, 38)" }}>ID Card</label>
                <input
                  type="text"
                  className="form-control"
                  id="username" // Ndryshimi këtu
                  placeholder="Enter ID Card"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="password" style={{ color: "rgb(244, 168, 38)" }}>Password</label> {/* Hapësira ekstra është fshirë */}
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter PIN"
                />
              </div>
              <button 
                type="submit" 
                className="btn w-10 mx-auto mt-auto"
                style={{ backgroundColor: "rgb(244, 168, 38)", color: "#fff" }}
              >
                Login
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-6 p-0">
          <img
            src="/p3.webp" // Përdorimi i rrugës absolute për imazhin nga dosja public
            alt="login illustration"
            className="img-fluid w-100 h-100 object-fit-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
