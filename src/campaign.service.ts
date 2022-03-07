import { Injectable } from '@nestjs/common';
import { BudgetService } from '../budget/budget.service';
import { CustomerService } from '../customer/customer.service';
import { resources, enums } from 'google-ads-api';

const campaignBudget2: resources.ICampaignBudget = {
  amount_micros: 12000000,
  name: 'My campaign aaa11244aazzaaa',
  explicitly_shared: false,
  period: 2,
};

@Injectable()
export class CampaignService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly budgetService: BudgetService,
  ) {}

  async create() {
    const customer = this.customerService.setCustomer();
    console.log(customer);
    let budget: string;

    try {
      const result = await customer.campaignBudgets.create([campaignBudget2]);
      budget = result.results[0].resource_name;
    } catch (err) {
      console.log(err);
    }
    console.log(budget);

    const campaign: resources.ICampaign = {
      name: 'new campaing 123455231',
      status: enums.CampaignStatus.PAUSED,
      campaign_budget: budget,
      advertising_channel_type: enums.AdvertisingChannelType.PERFORMANCE_MAX,
      maximize_conversions: {},
    };
    resources.Customer;
    try {
      const result = await customer.campaigns.create([campaign]);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  }

  async get() {
    const customer = this.customerService.setCustomer();
    const resourceName = 'customers/5848811884/campaigns/16474836669';
    try {
      const results = await customer.report({
        entity: 'campaign',
        attributes: [
          'campaign.name',
          'campaign.advertising_channel_type',
          'campaign.campaign_budget',
          'campaign.maximize_conversion_value.target_roas',
          'campaign.maximize_conversions.target_cpa',
          'campaign.status',
          'campaign.url_expansion_opt_out',
          'campaign.start_date',
          'campaign.end_date',
        ],
      });
      return results.find(
        (result) => result.campaign?.resource_name === resourceName,
      );
    } catch (err) {
      console.log(err);
    }
  }

  async update() {
    const customer = this.customerService.setCustomer();
    console.log(customer);
    let budget: string;

    try {
      const result = await customer.campaignBudgets.create([campaignBudget2]);
      budget = result.results[0].resource_name;
    } catch (err) {
      console.log(err);
    }
    console.log(budget);

    const campaign: resources.ICampaign = {
      resource_name: 'customers/5848811884/campaigns/16484937817',
      c,
    };

    try {
      const result = await customer.campaigns.update([campaign]);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  }

  async createBudgetAndCampaign() {
    const customer = this.customerService.setCustomer();
    try {
      const updatedCustomer = await customer.mutateResources([
        {
          entity: 'campaign_budget',
          operation: 'create',
          resource: {
            resource_name: 'customers/5848811884/campaignBudgets/-1',
            amount_micros: 12000000,
            name: 'My campaign buASacdxxccxxva2aa',
            explicitly_shared: false,
          },
        },
        {
          entity: 'campaign',
          operation: 'create',
          resource: {
            name: `21-new-campaign1213332c1121416777777`,
            status: enums.CampaignStatus.PAUSED,
            campaign_budget: 'customers/5848811884/campaignBudgets/-1',
            advertising_channel_type:
              enums.AdvertisingChannelType.PERFORMANCE_MAX,
            maximize_conversions: {},
          },
        },
      ]);
      console.log(updatedCustomer.mutate_operation_responses);
    } catch (err) {
      console.error(err);
    }
  }
}

// errors: [
//   GoogleAdsError {
//     error_code: [ErrorCode],
//     message: 'Resource was not found.',
//     trigger: [Value],
//     location: [ErrorLocation]
//   }
// ],

// const campaign: CampaignConversion = {
//   name: 'new-campaign 123',
//   campaign_budget: 'customers/6403556017/campaignBudgets/10515001862',
//   status: enums.CampaignStatus.PAUSED,
//   advertising_channel_type: enums.AdvertisingChannelType.PERFORMANCE_MAX,
//   maximize_conversion: { target_cpa: 2 },
//   url_expansion_opt_out: false,
// };
