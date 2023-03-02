import { Component } from 'react';
import Cookies from 'universal-cookie';
import Router from 'next/router';
import { CookieKeys, RouterKeys } from '../../constants/Keys';

import UserService from '../../services/API/User/User.service';

const AuthHoc = (AuthComponent: any) => (
  class MyComponent extends Component {
    static async getInitialProps(ctx: any) {
      try {
        const { req, res } = ctx;
        const token = req.cookies[CookieKeys.userLoginToken];
        if (!token) {
          res.writeHead(302, { Location: RouterKeys.login });
          res.end();
          return {};
        }
        const isApiMaintenance = await UserService.checkApiMaintenance();
        if (isApiMaintenance === 1) {
          res.writeHead(302, { Location: RouterKeys.maintenance });
          res.end();
          return {};
        }
        const initialProps = AuthComponent.getInitialProps ? await AuthComponent.getInitialProps(ctx) : {};
        return {
          ...initialProps
        };
      } catch (e) {
        return {};
      }
    }

    private readonly cookies = new Cookies();

    async componentDidMount () {
      const token = this.cookies.get(CookieKeys.userLoginToken);
      if (!token) {
        Router.push(RouterKeys.login);
      }
      try {
        const isApiMaintenance = await UserService.checkApiMaintenance();
        if (isApiMaintenance === 1) {
          Router.push(RouterKeys.maintenance);
        }
      } catch (error) {
        return {};
      }
    }

    render() {
      return <AuthComponent {...this.props} />;
    }
  }
);

export default AuthHoc;
