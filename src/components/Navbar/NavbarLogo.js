/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import Hotel from "../../images/hotel.png";


const NavbarLogo = () => {
    return (
        <img src={Hotel} alt="" css={logoStyles}/>
    )
}

const logoStyles = css`
  max-height: 90px; /* Điều chỉnh chiều cao tối đa của logo */
  width: auto; /* Đảm bảo logo giữ tỷ lệ chiều rộng */
  display: block; /* Đảm bảo logo không bị căn lề */
`;
export default NavbarLogo;