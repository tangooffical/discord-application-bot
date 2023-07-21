import { ChatInputCommandInteraction } from 'discord.js';
import Form from '../../models/Form.model.js';
import Action from '../../models/Action.model.js';

export default async function removeCommand(interaction: ChatInputCommandInteraction, currentForm: Form) {
	const name = await interaction.options.getString('name');
	Action.findOne({ where: { form_channel_id: currentForm.form_channel_id, name: name } })
		.then(async (action: Action | null) => {
			if (action === null) {
				await interaction.reply({ content: 'There is no action with that name configured for this form!', ephemeral: true });
			} else {
				await action.destroy();
				await interaction.reply({ content: `The action ${name} has been removed from this form!`, ephemeral: true });
			}
		})
		.catch(async () => {
			await interaction.reply({ content: 'There was an error removing the action!', ephemeral: true });
		});
}