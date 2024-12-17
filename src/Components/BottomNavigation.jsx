import { Box, Tab, Tabs} from "@mui/material";
import PropTypes from "prop-types";
//import Tabela from "../Pages/Turma/tabela";
import Chamada from "./Chamada";
import NewTabela from "./newTable";
//import React from "react";
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }
  
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
const MyBottomNavigation = ({value, setValue, turmaId})=>{

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
      <Box sx={{ 
        width: '100%', 

      }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display:"flex",justifyContent:"center"}}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Chamada" {...a11yProps(0)} />
            <Tab label="Alunos" {...a11yProps(1)} />
            <Tab label="Relatório" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Chamada turmaId={turmaId}/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <NewTabela turmaId={turmaId}/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
      </Box>
    );
}

MyBottomNavigation.propTypes = {
    value: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    turmaId: PropTypes.string.isRequired,
   
  };
export default MyBottomNavigation