import * as React from 'react';
import { styled, useTheme } from '@mui/system';
import {
    Tabs as BaseTabs,
    Tab as BaseTab,
    tabClasses,
    TabsList as BaseTabsList,
    TabPanel as BaseTabPanel,
    buttonClasses
} from '@mui/base';

const blue = {
    50: '#F0F7FF',
    100: '#C2E0FF',
    200: '#80BFFF',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
    800: '#004C99',
    900: '#003A75',
};
  
const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};
  
const Tab = styled(BaseTab)`
    font-family: 'IBM Plex Sans', sans-serif;
    color: #fff;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: transparent;
    width: 100%;
    padding: 10px 12px;
    margin: 6px;
    border: none;
    border-radius: 7px;
    display: flex;
    justify-content: center;
    flex-grow: 1;
  
    &:hover {
      background-color: ${blue[400]};
    }
  
    &:focus {
      color: #fff;
      outline: 3px solid ${blue[200]};
    }
  
    &.${tabClasses.selected} {
      background-color: #fff;
      color: ${blue[600]};
    }
  
    &.${buttonClasses.disabled} {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;
  
const TabPanel = styled(BaseTabPanel)(
    ({ theme }) => `
    width: 100%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    padding: 20px 12px;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    border-radius: 12px;
    opacity: 1;
    `,
);
  
const TabsList = styled(BaseTabsList)(
    ({ theme }) => `
    width: 68%;
    min-width: 400px;
    background-color: #1876D2;
    border-radius: 12px;
    margin: 0 auto;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: space-between;
    box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
    `,
);


const CustomTabs = ({ defaultValue, tabsData }) => {
    const theme = useTheme();
    return (
        <BaseTabs defaultValue={defaultValue}>
            <TabsList>
                {tabsData.map((tab, index) => (
                    <Tab key={index} value={index}>{tab.label}</Tab>
                ))}
            </TabsList>
            {tabsData.map((tab, index) => (
                <TabPanel key={index} value={index}>{tab.content}</TabPanel>
            ))}
        </BaseTabs>
    );
};

export default CustomTabs;