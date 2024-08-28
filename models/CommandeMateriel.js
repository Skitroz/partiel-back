module.exports = (sequelize, DataTypes) => {
    const CommandeMateriel = sequelize.define('CommandeMateriel', {
        quantite: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        prix: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    });

    return CommandeMateriel;
};
