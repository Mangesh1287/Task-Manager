import React from "react";
import "./style.css";
import icon_grid from "../../assets/images/icon-grid.png";
import icon_notifications from "../../assets/images/icon-notifications.png";
import icon_clock_bold_red from "../../assets/images/icon-clock-bold-red.png";

const Header = (props) => {
	return(
		<header>
			<div className="user">
				<img src={icon_grid} alt="User" /> Mike
			</div>
			<div className="notifications">
				<a href="javascript:void(0);" onClick={props.handleNotificationsDrawerOpen}>
					{
						(!props.isDrawerOpen) ? 
						<>
							<span className="count">4</span>
							<img src={icon_notifications} alt="Notifications" />
						</>
						:
						<>
							<span className="left-arrow"></span>
							<img src={icon_clock_bold_red} alt="Clock" />
						</>
					}
				</a>
			</div>
		</header>
	)
}

export default Header;