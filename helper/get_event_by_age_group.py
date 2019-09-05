import pandas as pd
import os

########################
# Load File
########################
__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
death_by_age_loc = os.path.join(__location__,'..' ,'data/trend/malaria-deaths-by-age.csv')

death_by_age_raw_df = pd.read_csv(death_by_age_loc)

def get_event_by_age_group():

    death_by_age_df = death_by_age_raw_df.drop(['Entity','Code'],axis=1).fillna(0)

    age_group_fields = list(death_by_age_df.columns)
    age_group_fields.remove('Year')

    death_by_age_group = death_by_age_df.groupby(['Year']).sum().reset_index().to_dict('records')

    return {'data':death_by_age_group,'field':age_group_fields}
