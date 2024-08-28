'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CommandeMateriel', {
      commandeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Commandes',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      materielId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Materiels',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      quantite: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      prix: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CommandeMateriel');
  }
};