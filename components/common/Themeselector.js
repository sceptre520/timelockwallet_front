import React from 'react';
import { useTheme } from 'next-themes';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import useStorage from './../../modules/hook.ts';

export const Themeselector = (props) => {
  const { theme, setTheme } = useTheme();
  const { getItem, setItem, removeItem } = useStorage();
  const walletTypeIndicator = 'ach_stake_theme';

  const [themeDlg, setThemeDlg] = React.useState(false);

  const changeTheme = (pmTheme) => {
    setTheme(pmTheme);
    setItem(walletTypeIndicator, pmTheme);
    setThemeDlg(false);
  }

  React.useEffect(() => {
    var cookie_theme = getItem(walletTypeIndicator);

    if (cookie_theme != undefined) {
      setTheme(cookie_theme);
    }
  }, []);

  return (
    <>
      <div
        onClick={() => setThemeDlg(true)}
      >
        {props.children}
      </div>

      <Dialog onClose={() => setThemeDlg(false)} open={themeDlg}>
        <DialogContent className="bg-th-background-secondary">
          <div className="absolute top-0 right-0 p-1 cursor-pointer hover:bg-slate-400 rounded-full" onClick={() => setThemeDlg(false)}>
            <CloseIcon className="text-white"></CloseIcon>
          </div>
          <div className="w-80 ml-2 px-1 overflow-y-auto">
            <div className='text-white text-lg'>Select theme</div>
            <div className='flex mt-3'>
              <div
                className='w-40 h-40 mr-1 border border-2 rounded-xl border-slate-300 bg-slate-900 cursor-pointer hover:bg-black flex justify-end items-end'
                onClick={() => changeTheme('dark')}
              >
                {theme == 'dark' &&
                  <div className='w-8 h-8 mr-1 mb-1 border border-white rounded-full bg-green-600 text-center text-white'>
                    <CheckIcon></CheckIcon>
                  </div>
                }
              </div>
              <div
                className='w-40 h-40 ml-1 border border-2 rounded-xl border-slate-300 bg-blue-800 cursor-pointer hover:bg-blue-900 flex justify-end items-end'
                onClick={() => changeTheme('blue')}
              >
                {theme == 'blue' &&
                  <div className='w-8 h-8 mr-1 mb-1 border border-white rounded-full bg-green-600 text-center text-white'>
                    <CheckIcon></CheckIcon>
                  </div>
                }
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}