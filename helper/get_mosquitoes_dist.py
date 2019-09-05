import pandas as pd
import os

__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
mosquitoes_loc = os.path.join(__location__,'..' ,'data/trend/mosquitoes2.csv')
mosquitoes_df = pd.read_csv(mosquitoes_loc)

def get_mosquitoes_geo():
    mosquitoes_df_clean = mosquitoes_df.dropna()
    moquitoes_dict = mosquitoes_df_clean.to_dict(orient='records')
    return moquitoes_dict

def get_mosquitoes_data_period():
    mosquitoes_period_list = list(mosquitoes_df['Year_Group'].unique())
    mosquitoes_year_list = list(map(lambda x: float(x.split('-')[0]),mosquitoes_period_list))

    mosquitoes_period_list_sorted = [x for _,x in sorted(zip(mosquitoes_year_list,mosquitoes_period_list))]

    return mosquitoes_period_list_sorted

print(get_mosquitoes_data_period())