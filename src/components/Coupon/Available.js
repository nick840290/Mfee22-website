import { React, useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';
import { API_URL } from '../../utils/config';
import { useLogin } from '../../context/LoginStatus';
import Swal from 'sweetalert2';

//取得目前使用者可領取的優惠券
const Available = () => {
  const [data, setData] = useState([]);
  const [member, setMember] = useState({});
  const { user } = useLogin();
  const isAvailableList = data.length === 0;

  useEffect(() => {
    let couponValid = async () => {
      let response = await axios.post(`${API_URL}/coupon/get/`, user, {
        withCredentials: true,
      });
      setData(response.data);
    };
    couponValid();

    let getProfile = async () => {
      let response = await axios.post(`${API_URL}/member/getprofile`, user, {
        withCredentials: true,
      });
      setMember(response.data[0]);
    };

    getProfile();
  }, []);

  async function getcoupon(coupon, e) {
    const couponReceive = { coupon_id: coupon.id, member_id: member.id };
    let response = await axios.post(`${API_URL}/coupon/post`, couponReceive);

    $(e.target)
      .parent()
      .parent()
      .removeClass('couponWrapper1')
      .addClass('couponWrapper');

    $(e.target)
      .removeClass('couponBtn1')
      .addClass('couponBtn')
      .attr('disabled', true)
      .html('已領取');

    $(e.target)
      .next()
      .children()
      .html(coupon.amount - 1);

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
      title: '領取成功',
    });
  }

  return (
    <>
      {!isAvailableList ? (
        <div className="coupons">
          <div className="row gx-3 gy-4">
            {data.map((coupon) => {
              return (
                <div className="col-lg-6 col-md-6 col-sm-12" key={coupon.id}>
                  <div className="couponWrapper1">
                    <div className="coupon">
                      <div className="coupon-detail pt-4 mb-3">
                        <div className="row gx-1">
                          <div className="col-3 d-flex align-items-center">
                            <h4 className="coupon-amount">
                              {/* <i className="fas fa-dollar-sign"></i> */}
                              {coupon.title}
                            </h4>
                          </div>
                          <div className="col-1">
                            <div className="sperate-line"></div>
                          </div>
                          <div className="col-8">
                            <div className="coupon-statement">
                              <h6 className="coupon-title">
                                {coupon.discription}
                              </h6>
                              <p className="coupon-period">
                                使用期限:
                                <br />
                                {coupon.start_time}至<br />
                                {coupon.end_time}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        className="couponBtn1"
                        onClick={(e) => {
                          getcoupon(coupon, e);
                        }}
                      >
                        可領取
                      </button>

                      <div className="e-tag e-tag--normal remain-coupon">
                        剩餘<span>{coupon.amount}</span>張
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="empty_img">
          <img
            className="img-responsive"
            src={
              require('../../img/common/illustration/order-empty.svg').default
            }
            alt=""
          />
          <h5>目前還沒有可領取的優惠券喔！</h5>
        </div>
      )}
    </>
  );
};

export default Available;
