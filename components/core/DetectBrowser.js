import React from "react";

import { useDispatch } from 'react-redux';
import { setNavg } from './../../modules/CoreSlice';

export const DetectBrowser = () => {
  const dispatch = useDispatch();

  const getOperatingSystem = (window) => {
    var operatingSystem = 'Not known';
    if (window.navigator.appVersion.indexOf('Win') !== -1) { operatingSystem = 'Windows OS'; }
    else if (window.navigator.appVersion.indexOf('Mac') !== -1) { operatingSystem = 'MacOS'; }
    else if (window.navigator.appVersion.indexOf('X11') !== -1) { operatingSystem = 'UNIX OS'; }
    else if (window.navigator.appVersion.indexOf('Linux') !== -1) { operatingSystem = 'Linux OS'; }
    else { operatingSystem = 'Others'; }
  
    return operatingSystem;
  }
  
  const getBrowser = (window) => {
    var currentBrowser = 'Not known';
    if (window.navigator.userAgent.indexOf('Chrome') !== -1) { currentBrowser = 'Google Chrome'; }
    else if (window.navigator.userAgent.indexOf('Firefox') !== -1) { currentBrowser = 'Mozilla Firefox'; }
    else if (window.navigator.userAgent.indexOf('MSIE') !== -1) { currentBrowser = 'Internet Exployer'; }
    else if (window.navigator.userAgent.indexOf('Edge') !== -1) { currentBrowser = 'Edge'; }
    else if (window.navigator.userAgent.indexOf('Safari') !== -1) { currentBrowser = 'Safari'; }
    else if (window.navigator.userAgent.indexOf('Opera') !== -1) { currentBrowser = 'Opera'; }
    else if (window.navigator.userAgent.indexOf('Opera') !== -1) { currentBrowser = 'YaBrowser'; }
    else { currentBrowser = 'Others'; }
  
    return currentBrowser;
  }

  const getSiteUrl = () => {
    if (window != undefined && window != null) {
      var url = window.location.href;
      url = url.split('://')[1];
      url = url.split('/')[0];
      return url;
    }
    return '';
  };

  React.useEffect(() => {
    if (window != undefined && window != null) {
      dispatch(setNavg({
        os: getOperatingSystem(window),
        browser: getBrowser(window),
        url: getSiteUrl()
      }))
    }
  }, [])

  return (
    <></>
  )
}
