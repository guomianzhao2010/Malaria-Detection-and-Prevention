import pandas as pd
import country_converter as coco
import os

########################
# Load File
########################
__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
death_loc = os.path.join(__location__,'..' ,'data/trend/death_by_country.csv')
incident_loc = os.path.join(__location__,'..' ,'data/trend/incident_by_country.csv')
precipitation_loc = os.path.join(__location__,'..' ,'data/trend/Precipitation.csv')
temperature_loc = os.path.join(__location__,'..' ,'data/trend/Temperature.csv')

death_df = pd.read_csv(death_loc,skiprows=[0])
incident_df = pd.read_csv(incident_loc,skiprows=[0])
precipitation_df = pd.read_csv(precipitation_loc)
temperature_df = pd.read_csv(temperature_loc)

########################
# Country to Alpha code
########################
death_df_name_list = list(death_df['Country'].values)
death_df_code_list = coco.convert(names=death_df_name_list,to="ISO3")

incident_df_name_list = list(incident_df['Country'].values)
incident_df_code_list = coco.convert(names=incident_df_name_list,to="ISO3")

death_df['alpha-3'] = death_df_code_list
incident_df['alpha-3'] = incident_df_code_list
########################
# Scale Precipitation
########################
precipitation_df['Annual_precip'] = precipitation_df['Annual_precip']/100

########################
# Merge the dataframe
########################
def get_death_prec_temp_data():
    death_prec_df = death_df.merge(precipitation_df,left_on='alpha-3', right_on='ISO_3DIGIT', how='inner')
    death_prec_temp_df = death_prec_df.merge(temperature_df,left_on='alpha-3', right_on='ISO_3DIGIT', how='inner')
    
    return death_prec_temp_df[['Country','2017','Annual_precip','Annual_temp']].rename(columns={'2017':'death'})

def get_incident_prec_temp_data():
    incident_prec_df = incident_df.merge(precipitation_df,left_on='alpha-3', right_on='ISO_3DIGIT', how='inner')
    incident_prec_temp_df = incident_prec_df.merge(temperature_df,left_on='alpha-3', right_on='ISO_3DIGIT', how='inner')
    
    return incident_prec_temp_df[['Country','2017','Annual_precip','Annual_temp']].rename(columns={'2017':'incident'})

