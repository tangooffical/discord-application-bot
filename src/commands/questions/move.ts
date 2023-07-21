import { ChatInputCommandInteraction } from 'discord.js';
import Form from '../../models/Form.model.js';
import Question from '../../models/Question.model.js';

export default async function moveCommand(interaction: ChatInputCommandInteraction, currentForm: Form) {
	const id = interaction.options.getInteger('id');
	const position = interaction.options.getInteger('position');

	const question = await Question.findOne({ where: { form_channel_id: currentForm.form_channel_id, question_id: id } });
	const questionAtPosition = await Question.findOne({ where: { form_channel_id: currentForm.form_channel_id, order: position } });
	if (!question || !questionAtPosition) {
		await interaction.reply({ content: 'There is no question with that ID or position configured for this form!', ephemeral: true });
		return;
	}

	// swap the order of the questions
	await interaction.deferReply({ ephemeral: true });
	try {
		await questionAtPosition.update({
			order: question.order,
		});

		await question.update({
			order: position,
		});

		await interaction.followUp({ content: `The question has been moved to position ${position}!`, ephemeral: true });
	} catch (error) {
		console.error(error);
		await interaction.followUp({ content: 'There was an error moving the question!', ephemeral: true });
	}
}