import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/config';
import { useLogin } from '../../context/LoginStatus';
import Swal from 'sweetalert2';

const EditPassWord = () => {
  const { user } = useLogin();
  const [data, setData] = useState([]);

  const [member, setMember] = useState({
    oldpassword: '',
    newpassword: '',
    confirmpassword: '',
  });

  //取得已登入會員的資訊
  useEffect(() => {
    let getProfile = async () => {
      let response = await axios.post(`${API_URL}/member/getprofile`, user, {
        withCredentials: true,
      });

      setData(response.data[0]);
    };
    getProfile();
  }, [user]);

  //取得使用者修改的內容
  function handleChange(e) {
    setMember({ ...member, [e.target.name]: e.target.value });
  }
  //將使用者修改的內容送至後端
  async function handleSubmit(e) {
    e.preventDefault();
    var user = Object.assign(data, member);

    try {
      let response = await axios.post(`${API_URL}/member/editpassword`, user);

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: false,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: 'success',
        title: response.data,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        text: err.response.data,
        customClass: {
          container: 'c-alert__overlay',
          popup: 'c-alert__modal',
          title: 'c-alert__title',
          htmlContainer: 'c-alert__text',
          confirmButton: 'e-btn e-btn--plain e-btn--medium ms-2',
          cancelButton: 'e-btn e-btn--cancel e-btn--medium',
        },
      });
    }
  }

  return (
    <>
      {data.password !== 'socialMedia' ? (
        <form className="c-member-info">
          <div className="container">
            <div className="row gx-5 gy-4">
              <div className="c-member-info__title">修改密碼</div>
              <div className="col-12">
                <label
                  htmlFor="OldPassword"
                  className="form-label c-form__label"
                >
                  舊密碼
                </label>
                <input
                  type="password"
                  className="form-control password__input__input c-form__input"
                  id="OldPassword"
                  placeholder="請輸入..."
                  autoComplete="on"
                  name="oldpassword"
                  value={member.oldpassword}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <label
                  htmlFor="NewPassword"
                  className="form-label c-form__label"
                >
                  新密碼
                </label>
                <input
                  type="password"
                  className="form-control password__input__input c-form__input"
                  id="NewPassword"
                  placeholder="請輸入..."
                  autoComplete="on"
                  name="newpassword"
                  value={member.newpassword}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <label
                  htmlFor="ConfirmPassword"
                  className="form-label c-form__label"
                >
                  確認密碼
                </label>
                <input
                  type="password"
                  className="form-control password__input__input c-form__input"
                  id="ConfirmPassword"
                  placeholder="請輸入..."
                  autoComplete="on"
                  name="confirmpassword"
                  value={member.confirmpassword}
                  onChange={handleChange}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="c-product-filter__action e-btn--primary e-btn--medium col-12"
                  onClick={handleSubmit}
                >
                  儲存變更
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <></>
      )}
    </>
  );
};

export default EditPassWord;
