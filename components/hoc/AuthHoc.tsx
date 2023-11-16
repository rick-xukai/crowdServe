// Temporarily hide the logic of the block app.
import { Component } from 'react';
import Cookies from 'universal-cookie';
import Router from 'next/router';
// import Image from 'next/image';

// import { Images } from '../../theme';
// import { MaintenancePageContainer } from '../../pages/maintenance';
// import Messages from '../../constants/Messages';
import { CookieKeys, RouterKeys } from '../../constants/Keys';
// import UserService from '../../services/API/User/User.service';

const AuthHoc = (AuthComponent: any) =>
  class MyComponent extends Component<any, any> {
    // constructor(props: any) {
    //   super(props);
    //   this.state = {
    //     maintenanceApiSuccess: true,
    //     loading: true,
    //   };
    // };

    static async getInitialProps(ctx: any) {
      try {
        const { req, res } = ctx;
        const token = req.cookies[CookieKeys.userLoginToken];
        const profileInfo = req.cookies[CookieKeys.userProfileInfo];
        if (!token) {
          res.writeHead(302, {
            Location: `${RouterKeys.login}?redirect=${req.url}`,
          });
          res.end();
          return {
            token: '',
          };
        }
        if (profileInfo && !req.url.includes('/profile') && token) {
          const {
            birthday,
            country,
            firstName,
            lastName,
            genderId,
            phoneNumber,
          } = JSON.parse(profileInfo);
          if (
            !birthday ||
            !country ||
            !firstName ||
            !lastName ||
            !genderId ||
            !phoneNumber
          ) {
            res.writeHead(302, {
              Location: `${RouterKeys.eventList}`,
            });
            res.end();
            return {
              props: {},
            };
          }
        }
        // const isApiMaintenance = await UserService.checkApiMaintenance();
        // if (isApiMaintenance === 1) {
        //   res.writeHead(302, { Location: RouterKeys.maintenance });
        //   res.end();
        //   return {};
        // }
        const initialProps = AuthComponent.getInitialProps
          ? await AuthComponent.getInitialProps(ctx)
          : { token };
        return {
          ...initialProps,
        };
      } catch (e) {
        return {
          token: '',
        };
      }
    }

    private readonly cookies = new Cookies();

    async componentDidMount() {
      const token = this.cookies.get(CookieKeys.userLoginToken);
      if (!token) {
        Router.push({
          pathname: RouterKeys.login,
          query: `redirect=${window.location.pathname}`,
        });
        return;
      }
      // try {
      //   const isApiMaintenance = await UserService.checkApiMaintenance();
      //   if (isApiMaintenance === 1) {
      //     Router.push(RouterKeys.maintenance);
      //     return;
      //   }
      //   this.setState({ loading: false });
      // } catch (error) {
      //   this.setState({ loading: false, maintenanceApiSuccess: false });
      //   return {};
      // }
    }

    render() {
      // const { maintenanceApiSuccess, loading } = this.state;

      // if (loading) {
      //   return null;
      // }

      return (
        <AuthComponent {...this.props} />
        // <>
        //   {maintenanceApiSuccess && (
        //     <AuthComponent {...this.props} />
        //   ) || (
        //     <MaintenancePageContainer>
        //       <div className="page-main">
        //         <div className="block-icon">
        //           <Image src={Images.NetworkError} alt="" />
        //         </div>
        //         <p className="title">
        //           {Messages.networkError.text}
        //         </p>
        //       </div>
        //     </MaintenancePageContainer>
        //   )}
        // </>
      );
    }
  };

export default AuthHoc;
