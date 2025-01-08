exports.FindAdmins = ({
  CreateError,
  logger,
  translate,
  request,
  db,
  ac,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.lang;
        const userUID = request.locals.uid;
        const role = request.locals.role;
        const urlParams = request.urlParams;
        const queryParams = request.queryParams;

        if (userUID === undefined) {
          throw new CreateError(translate(lang, 'invalid_details'));
        }

        let permission = ac.can(role).readOwn('admin');
        if (urlParams.userUID) {
          if (urlParams.userUID !== userUID) {
            permission = ac.can(role).readAny('admin');
          }
        }
        if (role === 'admin' || role === 'superadmin') {
          permission = ac.can(role).readAny('admin');
        }
        if (!permission.granted) {
          throw new CreateError(translate(lang, 'forbidden'), 403)
        }

        const userTable = db.methods.Admin({ translate, logger, CreateError, lang });
        if ((role === 'admin' || role === 'superadmin') && !urlParams.userUID) {
          let allAdmins = (await userTable
            .findAllAdmins(
              {
                offset: queryParams.offset,
                limit: queryParams.limit,
                sortBy: queryParams.sort_by,
                order: queryParams.order
              }
            ))
            .data;
          return {
            msg: translate(lang, 'success'),
            data: {
              admins: allAdmins.admins,
              offset: allAdmins.offset,
              limit: allAdmins.limit,
              sort_by: allAdmins.sortBy,
              order: allAdmins.order,
              sortable_columns: allAdmins.sortableColumns,
              total: allAdmins.total
            }
          } 
        } else {
          let admins = (await userTable
            .findAdminByUserUID({ userUID: urlParams.userUID}))
            .data.admins;

          if (admins === null) {
            throw new CreateError(translate(lang, 'admin_details_not_found'), 404)
          } else {
            admins = [admins];
          }
          return {
            msg: translate(lang, 'success'),
            data: {
              admin: admins
            }
          }
        }
      } catch (error) {
        if (error instanceof CreateError) {
            throw error;
        }
        logger.error(`Failed to find admins: %s`, error);
        throw new Error(error.message);
    }
    }
  });
}