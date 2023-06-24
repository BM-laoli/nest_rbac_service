import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DoPagenation } from 'src/core/utils/pagenation';
import { ACBInfoReqDTO } from 'src/dto/request/rbac.dto';
import { PagenationReqDTO } from 'src/dto/request/requestBase.dto';
import { ActionButton } from 'src/entities/rbac_db/action-button.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export default class ACBService {
  constructor(
    @InjectEntityManager('rbac_db')
    private entityManager: EntityManager,
  ) {}

  async addACB(createACBDTO: ACBInfoReqDTO) {
    return this.entityManager.save(ActionButton, createACBDTO);
  }

  async getAllACB(pageInfo: PagenationReqDTO) {
    const res = await DoPagenation<ActionButton>(
      pageInfo,
      this.entityManager,
      ActionButton,
      {},
      {},
    );
    return res;
  }

  async getACBDetail(id: number) {
    return this.entityManager.findOne(ActionButton, {
      where: { id: id },
    });
  }

  async updateACB(actionButtonInfo: ACBInfoReqDTO) {
    await this.entityManager.update(
      ActionButton,
      { id: actionButtonInfo.id },
      actionButtonInfo,
    );

    return this.getACBDetail(actionButtonInfo.id);
  }

  async deleteACB(ids: number[]) {
    return this.entityManager.delete(ActionButton, ids);
  }
}
