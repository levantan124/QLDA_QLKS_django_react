import React from "react"
import { Link } from "react-router-dom"

const Admin = () => {

	return (
		<section className="container mt-5">
			<h2>Welcome to Admin Panel</h2>
			<hr />
			<div className="btn-group">
				<Link to={"/existing-rooms"} className="btn">Manage Rooms</Link>
				<Link to={"/existing-roomTypes"} className="btn">Manage RoomTypes</Link>
				<Link to={"/existing-employees"} className="btn">Manage Employee</Link>
				<Link to={"/existing-customers"} className="btn">Manage Customer</Link>
			</div>
		</section>
	);

}

export default Admin