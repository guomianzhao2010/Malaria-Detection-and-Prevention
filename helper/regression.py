import pandas as pd
import numpy as np
import math
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures

########################
# Load File
########################

##Aggregating malaria death and child mortality rate data
malaria=pd.read_csv("data/trend/death_by_country_tracy.csv")
child=pd.read_csv("data/trend/child.csv")
child_death=child[child["Uncertainty bounds*"]=="Median"]
child_death.rename(columns={'Country':'Country Name'}, inplace=True)


malaria_child=pd.merge(malaria, child_death, on='Country Name', how='inner')
malaria_child=malaria_child.dropna(axis=0, how='any', thresh=None, subset=None, inplace=False)
malaria_child["Feature"]=malaria_child["U5MR.2017"]
malaria_child["Malaria_Num_Death"]=malaria_child["Num Death 2017"]
malaria_child=malaria_child[["Country Name","Feature","Malaria_Num_Death"]]


#Aggregating malaria death data and GDP data
gdp=pd.read_csv("data/trend/GDP_by_country.csv")
malaria_gdp=pd.merge(malaria, gdp, on='Country Name', how='inner')
malaria_gdp=malaria_gdp.dropna(axis=0, how='any', thresh=None, subset=None, inplace=False)
malaria_gdp["Feature"]=malaria_gdp["2017"]
malaria_gdp["Malaria_Num_Death"]=malaria_gdp["Num Death 2017"]
malaria_gdp= malaria_gdp[["Country Name","Feature","Malaria_Num_Death"]]

#Aggregating malaria death and Percipitation
p=pd.read_csv("data/trend/Precipitation.csv")
match=pd.read_csv("data/trend/code_match.csv")
percipitation=pd.merge(p, match, on='ISO_3DIGIT', how='inner')
malaria_percipitation=pd.merge(malaria, percipitation, on='Country Name', how='inner')
malaria_percipitation["Feature"]=malaria_percipitation["Annual_precip"]
malaria_percipitation["Malaria_Num_Death"]=malaria_percipitation["Num Death 2017"]
malaria_percipitation= malaria_percipitation[["Country Name","Feature","Malaria_Num_Death"]]
malaria_percipitation=malaria_percipitation.dropna(axis=0, how='any', thresh=None, subset=None, inplace=False)

#Aggregating malaria death and temperature
t=pd.read_csv("data/trend/Temperature.csv")
temperature=pd.merge(t, match, on='ISO_3DIGIT', how='inner')
malaria_temp=pd.merge(malaria, temperature, on='Country Name', how='inner')
malaria_temp["Feature"]=malaria_temp["Annual_temp"]
malaria_temp["Malaria_Num_Death"]=malaria_temp["Num Death 2017"]
malaria_temp= malaria_temp[["Country Name","Feature","Malaria_Num_Death"]]
malaria_temp=malaria_temp.dropna(axis=0, how='any', thresh=None, subset=None, inplace=False)
malaria_temp = malaria_temp.drop(malaria_temp[malaria_temp['Country Name']=="Angola"].index)
malaria_temp= malaria_temp.drop(malaria_temp[malaria_temp['Country Name']=="Democratic Republic of Congo"].index)


########################
# Data export
########################

def regress_child():
    malaria_child_17=LinearRegression()
    malaria_child_17.fit(malaria_child["Feature"].values.reshape(-1, 1),malaria_child["Malaria_Num_Death"].values.reshape(-1, 1))
    
    malaria_child_17_coef=malaria_child_17.coef_[0][0]
    malaria_child_17_intercept=malaria_child_17.intercept_[0]
    regress_child={}
    child_dict=malaria_child.to_dict()
    line_values={}
    line_values={"coef": malaria_child_17_coef, "intercept":malaria_child_17_intercept}
    regress_child={"scatter": child_dict, "line": line_values}
    return regress_child

def regress_gdp():
    malaria_gdp_17=LinearRegression()
    malaria_gdp_17.fit(malaria_gdp["Feature"].values.reshape(-1, 1),malaria_gdp["Malaria_Num_Death"].values.reshape(-1, 1))
    
    malaria_gdp_17_coef=malaria_gdp_17.coef_[0][0]
    malaria_gdp_17_intercept=malaria_gdp_17.intercept_[0]

    regress_gdp={}
    gdp_dict=malaria_gdp.to_dict()
    line_values={}
    line_values={"coef": malaria_gdp_17_coef, "intercept": malaria_gdp_17_intercept}
    regress_gdp={"scatter": gdp_dict, "line": line_values}
    
    return regress_gdp
   
def regress_rain():
    malaria_percipitation_17=LinearRegression()
    malaria_percipitation_17.fit(malaria_percipitation["Feature"].values.reshape(-1, 1),malaria_percipitation["Malaria_Num_Death"].values.reshape(-1, 1))

    malaria_percipitation_17_coef= malaria_percipitation_17.coef_[0][0]
    malaria_percipitation_17_intercept=malaria_percipitation_17.intercept_[0]

    regress_rain={}
    raining_dict=malaria_percipitation.to_dict()
    line_values={}
    line_values={"coef": malaria_percipitation_17_coef, "intercept": malaria_percipitation_17_intercept}
    regress_rain={"scatter": raining_dict, "line": line_values}
    
    return  regress_rain

def regress_temp():
    malaria_temp_17=LinearRegression()
    malaria_temp_17.fit(malaria_temp["Feature"].values.reshape(-1, 1),malaria_temp["Malaria_Num_Death"].values.reshape(-1, 1))

    malaria_temp_17_coef= malaria_temp_17.coef_[0][0]
    malaria_temp_17_intercept=malaria_temp_17.intercept_[0]

    regress_temp={}
    temp_dict=malaria_temp.to_dict()

    line_values={}
    line_values={"coef": malaria_temp_17_coef, "intercept": malaria_temp_17_intercept}
    regress_temp={"scatter": temp_dict, "line": line_values}

    return regress_temp


########################
# Quadratic Regression
########################
#child
def qua_child():
    poly_child=PolynomialFeatures(degree=2)
    x_poly_child = poly_child.fit_transform(malaria_child["Feature"].values.reshape(-1, 1))
    
    line_x_child=np.arange(malaria_child["Feature"].min(), malaria_child["Feature"].max(), 0.5)
    line_model_child = poly_child.transform(line_x_child.reshape(-1, 1))
    
    child_linmodel = LinearRegression()
    child_linmodel.fit(x_poly_child, malaria_child["Malaria_Num_Death"].values.reshape(-1, 1))
    line_model_child_y = child_linmodel.predict(line_model_child)

    qua_child= pd.DataFrame(line_x_child) 
    qua_child["xdata"]=qua_child[0]
    qua_child["ydata"]=line_model_child_y
    qua_child=qua_child[["xdata", "ydata"]]

    qua_child_dict={}
    qua_child_dict_line=qua_child.to_dict()
    child_dict=malaria_child.to_dict()
    qua_child_dict={"scatter": child_dict, "line":qua_child_dict_line}


    return qua_child_dict

def qua_gdp():
    poly_gdp=PolynomialFeatures(degree=2)
    x_poly_gdp = poly_gdp.fit_transform(malaria_gdp["Feature"].values.reshape(-1, 1))
    
    line_x_gdp=np.arange(malaria_gdp["Feature"].min(), malaria_gdp["Feature"].max(), 0.5)
    line_model_gdp = poly_gdp.transform(line_x_gdp.reshape(-1, 1))
    
    gdp_linmodel = LinearRegression()
    gdp_linmodel.fit(x_poly_gdp, malaria_gdp["Malaria_Num_Death"].values.reshape(-1, 1))
    line_model_gdp_y = gdp_linmodel.predict(line_model_gdp)

    qua_gdp= pd.DataFrame(line_x_gdp) 
    qua_gdp["xdata"]=qua_gdp[0]
    qua_gdp["ydata"]=line_model_gdp_y
    qua_gdp=qua_gdp[["xdata", "ydata"]]

    qua_gdp_dict={}
    qua_gdp_dict_line=qua_gdp.to_dict()
    gdp_dict=malaria_gdp.to_dict()
    qua_gdp_dict={"scatter": gdp_dict, "line":qua_gdp_dict_line}

    return qua_gdp_dict

def qua_percipitation():
    poly_percipitation=PolynomialFeatures(degree=2)
    x_poly_percipitation = poly_percipitation.fit_transform(malaria_percipitation["Feature"].values.reshape(-1, 1))
    
    line_x_percipitation=np.arange(malaria_percipitation["Feature"].min(), malaria_percipitation["Feature"].max(), 0.5)
    line_model_percipitation = poly_percipitation.transform(line_x_percipitation.reshape(-1, 1))
    
    percipitation_linmodel = LinearRegression()
    percipitation_linmodel.fit(x_poly_percipitation, malaria_percipitation["Malaria_Num_Death"].values.reshape(-1, 1))
    line_model_percipitation_y = percipitation_linmodel.predict(line_model_percipitation)

    qua_percipitation= pd.DataFrame(line_x_percipitation) 
    qua_percipitation["xdata"]=qua_percipitation[0]
    qua_percipitation["ydata"]=line_model_percipitation_y
    qua_percipitation=qua_percipitation[["xdata", "ydata"]]

    qua_percipitation_dict={}
    qua_percipitation_dict_line=qua_percipitation.to_dict()
    percipitation_dict=malaria_percipitation.to_dict()
    qua_percipitation_dict={"scatter": percipitation_dict, "line":qua_percipitation_dict_line}

    return qua_percipitation_dict

def qua_temp():
    poly_temp=PolynomialFeatures(degree=2)
    x_poly_temp = poly_temp.fit_transform(malaria_temp["Feature"].values.reshape(-1, 1))
    
    line_x_temp=np.arange(malaria_temp["Feature"].min(), malaria_temp["Feature"].max(), 0.5)
    line_model_temp = poly_temp.transform(line_x_temp.reshape(-1, 1))
    
    temp_linmodel = LinearRegression()
    temp_linmodel.fit(x_poly_temp, malaria_temp["Malaria_Num_Death"].values.reshape(-1, 1))
    line_model_temp_y = temp_linmodel.predict(line_model_temp)

    qua_temp= pd.DataFrame(line_x_temp) 
    qua_temp["xdata"]=qua_temp[0]
    qua_temp["ydata"]=line_model_temp_y
    qua_temp=qua_temp[["xdata", "ydata"]]

    qua_temp_dict={}
    qua_temp_dict_line=qua_temp.to_dict()
    temp_dict=malaria_temp.to_dict()
    qua_temp_dict={"scatter": temp_dict, "line":qua_temp_dict_line}

    return qua_temp_dict
